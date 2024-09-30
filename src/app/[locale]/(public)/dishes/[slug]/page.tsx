import dishApiRequest from "@/apiRequests/dish";
import DishDetail from "@/app/[locale]/(public)/dishes/[slug]/dish-detail";
import {
  formatCurrency,
  generateSlugUrl,
  getIdFromSlugify,
  wrapServerApi,
} from "@/lib/utils";
import Image from "next/image";
import React from "react";

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
