import { setRequestLocale } from "next-intl/server";
import { ReturnFormPage } from "@/modules/returns/presentation/components";

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function NewReturnPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <ReturnFormPage />;
}
