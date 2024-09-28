import dishApiRequest from "@/apiRequests/dish";
import DishDetail from "@/app/(public)/dishes/[id]/dish-detail";
import { formatCurrency, wrapServerApi } from "@/lib/utils";
import Image from "next/image";
import React from "react";

export default async function DishPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const data = await wrapServerApi(() => dishApiRequest.getDish(Number(id)));
  const dish = data?.payload.data;
  return <DishDetail dish={dish}></DishDetail>;
}
