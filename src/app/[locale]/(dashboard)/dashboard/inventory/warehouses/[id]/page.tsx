import { setRequestLocale } from "next-intl/server";
import { WarehouseDetail } from "@/modules/inventory/presentation/components";

interface Props {
  params: Promise<{ locale: string; id: string }>;
}

export default async function WarehouseDetailPage({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  return <WarehouseDetail warehouseId={id} />;
}
