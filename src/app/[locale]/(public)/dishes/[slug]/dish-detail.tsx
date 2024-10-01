import dishApiRequest from "@/apiRequests/dish";
import { formatCurrency, wrapServerApi } from "@/lib/utils";
import { DishResType } from "@/schemaValidations/dish.schema";
import Image from "next/image";
import React from "react";

export default async function DishDetail({
  dish,
}: {
  dish: DishResType["data"] | undefined;
}) {
  if (!dish)
    return (
      <div>
        <h1 className="text-2xl lg:text-3xl">Món ăn không tồn tại</h1>
      </div>
    );

  return (
    <div className="space-y-4">
      <h1 className="text-2xl lg:text-3xl">{dish.name}</h1>
      <div className="font-semibold">Gía: {formatCurrency(dish.price)}</div>
      <Image
        src={dish.image}
        alt={dish.name}
        width={700}
        height={700}
        quality={100}
        className="object-cover  w-[500px] h-[500px] rounded-md"
        title={dish.name}
      />
      <p>{dish.description}</p>
    </div>
  );
}
