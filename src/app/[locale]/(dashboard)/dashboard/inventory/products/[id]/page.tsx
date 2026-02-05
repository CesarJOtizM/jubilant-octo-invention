import { setRequestLocale } from "next-intl/server";
import { ProductDetail } from "@/modules/inventory/presentation/components";

interface Props {
  params: Promise<{ locale: string; id: string }>;
}

export default async function ProductDetailPage({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  return <ProductDetail productId={id} />;
}
