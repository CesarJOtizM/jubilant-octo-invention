import { setRequestLocale } from "next-intl/server";
import { ProductFormPage } from "@/modules/inventory/presentation/components";

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function NewProductPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <ProductFormPage />;
}
