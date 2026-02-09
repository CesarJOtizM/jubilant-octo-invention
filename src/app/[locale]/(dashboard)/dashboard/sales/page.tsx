import { getTranslations, setRequestLocale } from "next-intl/server";
import { SaleList } from "@/modules/sales/presentation/components";

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function SalesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("sales");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
          {t("title")}
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400">
          {t("description")}
        </p>
      </div>
      <SaleList />
    </div>
  );
}
