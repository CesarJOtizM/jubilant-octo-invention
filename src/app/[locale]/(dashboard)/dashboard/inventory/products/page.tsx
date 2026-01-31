import { getTranslations, setRequestLocale } from "next-intl/server";
import { PagePlaceholder } from "@/ui/components/page-placeholder";

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function ProductsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("pages.inventory.products");

  return <PagePlaceholder title={t("title")} description={t("description")} />;
}
