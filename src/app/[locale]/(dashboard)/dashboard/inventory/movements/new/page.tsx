import { setRequestLocale } from "next-intl/server";
import { MovementFormPage } from "@/modules/inventory/presentation/components";

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function NewMovementPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <MovementFormPage />;
}
