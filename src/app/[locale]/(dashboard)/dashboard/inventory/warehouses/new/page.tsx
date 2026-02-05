import { setRequestLocale } from "next-intl/server";
import { WarehouseFormPage } from "@/modules/inventory/presentation/components";

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function NewWarehousePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <WarehouseFormPage />;
}
