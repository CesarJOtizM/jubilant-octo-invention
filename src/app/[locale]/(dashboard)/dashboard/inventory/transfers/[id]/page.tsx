import { setRequestLocale } from "next-intl/server";
import { TransferDetail } from "@/modules/inventory/presentation/components";

interface Props {
  params: Promise<{ locale: string; id: string }>;
}

export default async function TransferDetailPage({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  return <TransferDetail transferId={id} />;
}
