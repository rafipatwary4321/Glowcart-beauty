export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/auth";
import { env } from "@/config/env";
import { ApiRouteError, apiSuccess, withDb } from "@/lib/api";
import {
  assertOrderAwaitingPayment,
  buildProductSummary,
  findPayableOrder,
  generatePaymentTransactionId,
  initSSLCommerzSession,
  PaymentConfigError,
} from "@/lib/payment";

const initSchema = z.object({
  orderId: z.string().min(1, "Order id is required."),
});

export const POST = withDb(async (request: Request) => {
  const session = await auth();

  if (!session?.user?.id) {
    throw new ApiRouteError("Sign in to start payment.", 401);
  }

  const body = await request.json();
  const parsed = initSchema.safeParse(body);

  if (!parsed.success) {
    throw new ApiRouteError(parsed.error.issues[0]?.message ?? "Invalid payload.", 400);
  }

  const order = await findPayableOrder(parsed.data.orderId, session.user.id);

  if (order.paymentMethod !== "sslcommerz") {
    throw new ApiRouteError("Order is not configured for SSLCommerz.", 400);
  }

  assertOrderAwaitingPayment(order);

  const transactionId =
    order.transactionId ?? generatePaymentTransactionId(order.orderNumber);
  const appUrl = env.appUrl.replace(/\/$/, "");

  try {
    const sessionResult = await initSSLCommerzSession({
      orderId: order._id.toString(),
      orderNumber: order.orderNumber,
      amount: order.total,
      transactionId,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone,
      shippingAddress: {
        line1: order.shippingAddress.line1,
        line2: order.shippingAddress.line2 ?? undefined,
        city: order.shippingAddress.city,
        postalCode: order.shippingAddress.postalCode,
      },
      productName: buildProductSummary(order),
      successUrl: `${appUrl}/api/payment/sslcommerz/success`,
      failUrl: `${appUrl}/api/payment/sslcommerz/fail`,
      cancelUrl: `${appUrl}/api/payment/sslcommerz/cancel`,
    });

    order.transactionId = sessionResult.transactionId;
    await order.save();

    return apiSuccess({
      gatewayUrl: sessionResult.gatewayUrl,
      transactionId: sessionResult.transactionId,
      paymentMethod: "sslcommerz" as const,
    });
  } catch (error) {
    if (error instanceof PaymentConfigError) {
      throw new ApiRouteError(error.message, 503);
    }
    throw error;
  }
});

export function GET() {
  return NextResponse.json(
    { success: false, error: "Use POST to initialize SSLCommerz payment." },
    { status: 405 }
  );
}
