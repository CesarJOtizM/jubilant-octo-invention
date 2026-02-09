import { setRequestLocale } from "next-intl/server";
import { SaleFormPage } from "@/modules/sales/presentation/components";

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function NewSalePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <SaleFormPage />;
}
