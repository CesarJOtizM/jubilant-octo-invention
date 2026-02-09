import { setRequestLocale } from "next-intl/server";
import { UserList } from "@/modules/users/presentation/components";

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function UsersPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <UserList />;
}
