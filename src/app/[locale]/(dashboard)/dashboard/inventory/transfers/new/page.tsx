import { setRequestLocale } from "next-intl/server";
import { TransferFormPage } from "@/modules/inventory/presentation/components";

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function NewTransferPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <TransferFormPage />;
}
