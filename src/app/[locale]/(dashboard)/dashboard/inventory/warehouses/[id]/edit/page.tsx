import { setRequestLocale } from "next-intl/server";
import { WarehouseFormPage } from "@/modules/inventory/presentation/components";

interface Props {
  params: Promise<{ locale: string; id: string }>;
}

export default async function EditWarehousePage({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  return <WarehouseFormPage warehouseId={id} />;
}
