import { setRequestLocale } from "next-intl/server";
import { ProductFormPage } from "@/modules/inventory/presentation/components";

interface Props {
  params: Promise<{ locale: string; id: string }>;
}

export default async function EditProductPage({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  return <ProductFormPage productId={id} />;
}
