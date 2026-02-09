import { setRequestLocale } from "next-intl/server";
import { ReturnDetail } from "@/modules/returns/presentation/components";

interface Props {
  params: Promise<{ locale: string; id: string }>;
}

export default async function ReturnDetailPage({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  return <ReturnDetail returnId={id} />;
}
