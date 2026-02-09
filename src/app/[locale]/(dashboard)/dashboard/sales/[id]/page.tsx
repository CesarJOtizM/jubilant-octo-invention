import { setRequestLocale } from "next-intl/server";
import { SaleDetail } from "@/modules/sales/presentation/components";

interface Props {
  params: Promise<{ locale: string; id: string }>;
}

export default async function SaleDetailPage({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  return <SaleDetail saleId={id} />;
}
