import dishApiRequest from "@/apiRequests/dish";
import DishDetail from "@/app/[locale]/(public)/dishes/[slug]/dish-detail";
import envConfig, { Locale } from "@/config";
import {
  formatCurrency,
  generateSlugUrl,
  getIdFromSlugify,
  wrapServerApi,
} from "@/lib/utils";
import { baseOpenGraph } from "@/shared-metadata";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import React, { cache } from "react";
const getDetail = cache((id: number) =>
  wrapServerApi(() => dishApiRequest.getDish(id))
);
type Props = {
  params: { slug: string; locale: Locale };
  searchParams: { [key: string]: string | string[] | undefined };
};
export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const t = await getTranslations({
    locale: params.locale,
    namespace: "DishDetail",
  });
  const id = getIdFromSlugify(params.slug);
  const data = await getDetail(id);
  const dish = data?.payload.data;
  if (!dish) {
    return {
      title: t("notFound"),
      description: t("notFound"),
    };
  }
  const url =
    envConfig.NEXT_PUBLIC_URL +
    `/${params.locale}/dishes/${generateSlugUrl({
      name: dish.name,
      id: dish.id,
    })}`;
  return {
    title: dish.name,
    description: dish.description,
    openGraph: {
      ...baseOpenGraph,
      title: dish.name,
      description: dish.description,
      url,
      images: [
        {
          url: dish.image,
        },
      ],
    },
    alternates: {
      canonical: url,
    },
  };
}
// Sử dụng hàm này để biến dish detail từ dynamic rendering => static rendering
// Nhưng hiện nay generateStaticParams không thể dùng chung với next-intl (đa ngôn  ngữ)
// export async function generateStaticParams() {
//   const data = await wrapServerApi(() => dishApiRequest.list());
//   const list = data?.payload.data ?? [];
//   return list.map((dish) => ({
//     slug: generateSlugUrl({ name: dish.name, id: dish.id }),
//   }));
// }

export default async function DishPage({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const id = getIdFromSlugify(slug);
  const data = await wrapServerApi(() => dishApiRequest.getDish(id));
  const dish = data?.payload.data;
  return <DishDetail dish={dish}></DishDetail>;
}