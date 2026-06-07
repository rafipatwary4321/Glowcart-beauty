export const runtime = "nodejs";

import { NextResponse } from "next/server";

import { routes } from "@/constants/routes";
import { env } from "@/config/env";
import { withDb } from "@/lib/api";
import {
  fulfillOrderInventory,
  PaymentValidationError,
  updateOrderPaymentState,
  validateSSLCommerzPayment,
} from "@/lib/payment";
import { sendPaymentSuccessEmail } from "@/lib/email";
import { appendTrackingEvent } from "@/lib/orders/tracking";
import { Order } from "@/models";

function getCallbackParams(request: Request): URLSearchParams {
  const url = new URL(request.url);
  const params = new URLSearchParams(url.search);

  if (request.method === "POST") {
    return params;
  }

  return params;
}

async function readCallbackParams(request: Request): Promise<URLSearchParams> {
  if (request.method === "POST") {
    const contentType = request.headers.get("content-type") ?? "";

    if (contentType.includes("application/json")) {
      const body = (await request.json()) as Record<string, string>;
      return new URLSearchParams(body);
    }

    const form = await request.formData();
    const params = new URLSearchParams();
    form.forEach((value, key) => {
      params.set(key, String(value));
    });
    return params;
  }

  return getCallbackParams(request);
}

export const GET = withDb(async (request: Request) => handleSuccess(request));
export const POST = withDb(async (request: Request) => handleSuccess(request));

async function handleSuccess(request: Request) {
  const params = await readCallbackParams(request);
  const valId = params.get("val_id") ?? "";
  const tranId = params.get("tran_id") ?? "";
  const orderId = params.get("value_a") ?? "";
  const appUrl = env.appUrl.replace(/\/$/, "");

  try {
    if (!orderId) {
      throw new PaymentValidationError("Missing order reference.");
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return NextResponse.redirect(`${appUrl}${routes.checkout}?payment=error`);
    }

    if (order.paymentStatus === "paid") {
      return NextResponse.redirect(`${appUrl}${routes.orderSuccess(order._id.toString())}`);
    }

    const validation = await validateSSLCommerzPayment(valId);

    if (!validation.valid) {
      await updateOrderPaymentState(order, {
        paymentStatus: "failed",
        paymentGatewayResponse: validation.raw,
      });
      return NextResponse.redirect(
        `${appUrl}${routes.checkout}?payment=failed&orderId=${order._id.toString()}`
      );
    }

    if (validation.transactionId !== order.transactionId && tranId !== order.transactionId) {
      await updateOrderPaymentState(order, {
        paymentStatus: "failed",
        paymentGatewayResponse: validation.raw,
      });
      return NextResponse.redirect(
        `${appUrl}${routes.checkout}?payment=failed&orderId=${order._id.toString()}`
      );
    }

    if (Math.abs(validation.amount - order.total) > 0.01) {
      await updateOrderPaymentState(order, {
        paymentStatus: "failed",
        paymentGatewayResponse: validation.raw,
      });
      return NextResponse.redirect(
        `${appUrl}${routes.checkout}?payment=failed&orderId=${order._id.toString()}`
      );
    }

    await updateOrderPaymentState(order, {
      paymentStatus: "paid",
      orderStatus: "confirmed",
      transactionId: validation.transactionId || tranId || order.transactionId,
      paymentGatewayResponse: validation.raw,
    });

    await fulfillOrderInventory(order);
    await appendTrackingEvent(order._id.toString(), {
      status: "confirmed",
      note: "Payment confirmed",
    });

    void sendPaymentSuccessEmail({
      to: order.customerEmail,
      customerName: order.customerName,
      orderNumber: order.orderNumber,
      total: order.total,
      transactionId: validation.transactionId || tranId || order.transactionId,
    }).catch(() => undefined);

    return NextResponse.redirect(`${appUrl}${routes.orderSuccess(order._id.toString())}`);
  } catch {
    return NextResponse.redirect(`${appUrl}${routes.checkout}?payment=error`);
  }
}
