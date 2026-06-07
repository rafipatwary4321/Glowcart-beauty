import type { Metadata } from "next";

import { OrderTrackingDetail } from "@/components/profile/order-tracking-detail";
import { Container } from "@/components/common/container";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Order ${id}`,
    description: "Track your GlowCart Beauty order.",
  };
}

export default async function ProfileOrderDetailPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <section className="py-8 sm:py-10">
      <Container className="max-w-5xl">
        <OrderTrackingDetail orderId={id} />
      </Container>
    </section>
  );
}
