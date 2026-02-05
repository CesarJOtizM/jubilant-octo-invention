import { getTranslations, setRequestLocale } from "next-intl/server";
import { TransferList } from "@/modules/inventory/presentation/components";

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function TransfersPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("inventory.transfers");

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
      <TransferList />
    </div>
  );
}
