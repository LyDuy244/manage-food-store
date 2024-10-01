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
        <h1 className="text-2xl lg:text-3xl font-semibold text-center">
          Món ăn không tồn tại
        </h1>
      </div>
    );

  return (
    <div className="mx-auto space-y-4 w-[700px] mt-5">
      <h1 className="text-2xl lg:text-3xl text-center font-semibold">
        {dish.name}
      </h1>
      <div className="font-semibold ">Giá: {formatCurrency(dish.price)}</div>
      <Image
        src={dish.image}
        alt={dish.name}
        width={500}
        height={500}
        quality={100}
        className="object-cover  w-[700px] h-[500px] rounded-md"
        title={dish.name}
      />
      <p>{dish.description}</p>
    </div>
  );
}
