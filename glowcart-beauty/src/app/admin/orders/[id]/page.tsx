import { AdminOrderDetail } from "@/components/admin/admin-order-detail";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminOrderDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <AdminOrderDetail orderId={id} />;
}
