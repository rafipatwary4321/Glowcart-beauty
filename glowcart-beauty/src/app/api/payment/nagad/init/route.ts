export const runtime = "nodejs";

import { auth } from "@/auth";
import { ApiRouteError, withDb } from "@/lib/api";
import { createNagadPayment, findPayableOrder, assertOrderAwaitingPayment, PaymentConfigError } from "@/lib/payment";
import { generatePaymentTransactionId } from "@/lib/payment/sslcommerz";
import { z } from "zod";

const initSchema = z.object({
  orderId: z.string().min(1),
});

export const POST = withDb(async (request: Request) => {
  const session = await auth();
  if (!session?.user?.id) throw new ApiRouteError("Sign in to start payment.", 401);

  const parsed = initSchema.safeParse(await request.json());
  if (!parsed.success) throw new ApiRouteError("Invalid payload.", 400);

  const order = await findPayableOrder(parsed.data.orderId, session.user.id);
  if (order.paymentMethod !== "nagad") throw new ApiRouteError("Order is not configured for Nagad.", 400);
  assertOrderAwaitingPayment(order);

  const transactionId = order.transactionId ?? generatePaymentTransactionId(order.orderNumber);

  try {
    const result = await createNagadPayment({
      orderId: order._id.toString(),
      amount: order.total,
      transactionId,
      customerPhone: order.customerPhone,
    });

    order.transactionId = result.transactionId;
    await order.save();

    return Response.json({
      success: true,
      data: {
        gatewayUrl: result.gatewayUrl,
        transactionId: result.transactionId,
        paymentMethod: "nagad",
      },
    });
  } catch (error) {
    if (error instanceof PaymentConfigError) {
      throw new ApiRouteError(error.message, 503);
    }
    throw error;
  }
});
