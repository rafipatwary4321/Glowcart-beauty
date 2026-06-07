import { env } from "@/config/env";
import { routes } from "@/constants/routes";

import { sendEmail } from "../transporter";
import { renderEmailLayout } from "./layout";

const appUrl = () => env.appUrl.replace(/\/$/, "");

export async function sendRegistrationEmail(input: { to: string; name: string }) {
  const html = renderEmailLayout({
    title: "Welcome to GlowCart Beauty",
    preheader: "Your account is ready.",
    body: `<p>Hi ${input.name},</p>
      <p>Thanks for joining GlowCart Beauty. Your account has been created successfully.</p>
      <p>Start exploring curated skincare, makeup, and beauty essentials made for you.</p>`,
    ctaLabel: "Start Shopping",
    ctaHref: `${appUrl()}${routes.products}`,
  });

  return sendEmail({
    to: input.to,
    subject: "Welcome to GlowCart Beauty",
    html,
    text: `Hi ${input.name}, welcome to GlowCart Beauty.`,
  });
}

export async function sendOrderPlacedEmail(input: {
  to: string;
  customerName: string;
  orderNumber: string;
  total: number;
  paymentMethod: string;
}) {
  const html = renderEmailLayout({
    title: "Order Received",
    preheader: `Order ${input.orderNumber} has been placed.`,
    body: `<p>Hi ${input.customerName},</p>
      <p>We received your order <strong>${input.orderNumber}</strong>.</p>
      <p><strong>Total:</strong> ৳${input.total.toLocaleString("en-BD")}<br/>
      <strong>Payment:</strong> ${input.paymentMethod}</p>
      <p>We will notify you when your order status changes.</p>`,
    ctaLabel: "View Order",
    ctaHref: `${appUrl()}${routes.profile}/orders`,
  });

  return sendEmail({
    to: input.to,
    subject: `Order ${input.orderNumber} placed`,
    html,
  });
}

export async function sendPaymentSuccessEmail(input: {
  to: string;
  customerName: string;
  orderNumber: string;
  total: number;
  transactionId?: string;
}) {
  const html = renderEmailLayout({
    title: "Payment Successful",
    preheader: `Payment confirmed for ${input.orderNumber}.`,
    body: `<p>Hi ${input.customerName},</p>
      <p>Your payment for order <strong>${input.orderNumber}</strong> was successful.</p>
      <p><strong>Amount:</strong> ৳${input.total.toLocaleString("en-BD")}</p>
      ${input.transactionId ? `<p><strong>Transaction ID:</strong> ${input.transactionId}</p>` : ""}`,
    ctaLabel: "View Order",
    ctaHref: `${appUrl()}${routes.profile}/orders`,
  });

  return sendEmail({
    to: input.to,
    subject: `Payment received — ${input.orderNumber}`,
    html,
  });
}

export async function sendOrderShippedEmail(input: {
  to: string;
  customerName: string;
  orderNumber: string;
  trackingCode?: string;
}) {
  const html = renderEmailLayout({
    title: "Your Order Has Shipped",
    preheader: `Order ${input.orderNumber} is on the way.`,
    body: `<p>Hi ${input.customerName},</p>
      <p>Great news — your order <strong>${input.orderNumber}</strong> has shipped.</p>
      ${input.trackingCode ? `<p><strong>Tracking code:</strong> ${input.trackingCode}</p>` : ""}`,
    ctaLabel: "Track Order",
    ctaHref: `${appUrl()}${routes.profile}/orders`,
  });

  return sendEmail({
    to: input.to,
    subject: `Order ${input.orderNumber} shipped`,
    html,
  });
}

export async function sendOrderDeliveredEmail(input: {
  to: string;
  customerName: string;
  orderNumber: string;
  trackingCode?: string;
}) {
  const html = renderEmailLayout({
    title: "Order Delivered",
    preheader: `Order ${input.orderNumber} was delivered.`,
    body: `<p>Hi ${input.customerName},</p>
      <p>Your order <strong>${input.orderNumber}</strong> has been delivered.</p>
      ${input.trackingCode ? `<p><strong>Tracking code:</strong> ${input.trackingCode}</p>` : ""}
      <p>We hope you love your GlowCart Beauty picks.</p>`,
    ctaLabel: "Shop Again",
    ctaHref: `${appUrl()}${routes.products}`,
  });

  return sendEmail({
    to: input.to,
    subject: `Order ${input.orderNumber} delivered`,
    html,
  });
}

export async function sendPasswordResetEmail(input: {
  to: string;
  name: string;
  resetUrl: string;
}) {
  const html = renderEmailLayout({
    title: "Reset Your Password",
    preheader: "Use the secure link to reset your password.",
    body: `<p>Hi ${input.name},</p>
      <p>We received a request to reset your GlowCart Beauty password.</p>
      <p>This link expires in 1 hour. If you did not request this, you can ignore this email.</p>`,
    ctaLabel: "Reset Password",
    ctaHref: input.resetUrl,
  });

  return sendEmail({
    to: input.to,
    subject: "Reset your GlowCart Beauty password",
    html,
  });
}
