export const runtime = "nodejs";

import { NextResponse } from "next/server";

import { routes } from "@/constants/routes";
import { env } from "@/config/env";
import { withDb } from "@/lib/api";
import { updateOrderPaymentState } from "@/lib/payment";
import { Order } from "@/models";

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

  return new URLSearchParams(new URL(request.url).search);
}

export const GET = withDb(async (request: Request) => handleFail(request));
export const POST = withDb(async (request: Request) => handleFail(request));

async function handleFail(request: Request) {
  const params = await readCallbackParams(request);
  const orderId = params.get("value_a") ?? "";
  const appUrl = env.appUrl.replace(/\/$/, "");

  if (orderId) {
    const order = await Order.findById(orderId);

    if (order && order.paymentStatus === "pending") {
      const raw: Record<string, string> = {};
      params.forEach((value, key) => {
        raw[key] = value;
      });

      await updateOrderPaymentState(order, {
        paymentStatus: "failed",
        paymentGatewayResponse: raw,
      });
    }

    return NextResponse.redirect(
      `${appUrl}${routes.checkout}?payment=failed&orderId=${orderId}`
    );
  }

  return NextResponse.redirect(`${appUrl}${routes.checkout}?payment=failed`);
}
