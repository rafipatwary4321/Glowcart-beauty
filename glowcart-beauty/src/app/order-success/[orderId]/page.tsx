import type { Metadata } from "next";

import { OrderSuccessContent } from "@/components/checkout";
import { Container } from "@/components/common/container";

type OrderSuccessPageProps = {
  params: Promise<{ orderId: string }>;
};

export const metadata: Metadata = {
  title: "Order Confirmed",
  description: "Your GlowCart Beauty order has been placed.",
};

export default async function OrderSuccessPage({ params }: OrderSuccessPageProps) {
  const { orderId } = await params;

  return (
    <section className="bg-beige-50/30 py-10 sm:py-14 lg:py-16">
      <Container>
        <OrderSuccessContent orderId={orderId} />
      </Container>
    </section>
  );
}
