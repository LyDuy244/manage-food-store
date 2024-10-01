import Image from "next/image";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MenuOrder from "@/app/[locale]/guest/menu/menu-order";
import envConfig, { Locale } from "@/config";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { baseOpenGraph } from "@/shared-metadata";
type Props = {
  params: { locale: Locale };
  searchParams: { [key: string]: string | string[] | undefined };
};
export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const t = await getTranslations({
    locale: params.locale,
    namespace: "GuestMenu",
  });
  const url = envConfig.NEXT_PUBLIC_URL + `/${params.locale}/guest/menu`;
  return {
    title: t("title"),
    description: t("description"),
    openGraph: {
      ...baseOpenGraph,
      title: t("title"),
      description: t("description"),
      url,
    },
    alternates: {
      canonical: url,
    },
    robots: {
      index: false,
    },
  };
}
export default async function MenuPage() {
  return (
    <div className="max-w-[400px] mx-auto space-y-4">
      <h1 className="text-center text-xl font-bold">🍕 Menu quán</h1>
      <MenuOrder />
    </div>
  );
}