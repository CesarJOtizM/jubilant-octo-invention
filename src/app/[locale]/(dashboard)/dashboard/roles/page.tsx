import { setRequestLocale } from "next-intl/server";
import { RoleList } from "@/modules/roles/presentation/components";

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function RolesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <RoleList />;
}
