"use client";
import Quantity from "@/app/guest/menu/quantity";
import { useDishListQuery } from "@/app/queries/useDish";
import { useGuestOrderMutation } from "@/app/queries/useGuest";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DishStatus } from "@/constants/type";
import { toast } from "@/hooks/use-toast";
import {
  formatCurrency,
  getVietnameseOrderStatus,
  handleErrorApi,
} from "@/lib/utils";
import {
  GuestCreateOrdersBodyType,
  GuestCreateOrdersResType,
} from "@/schemaValidations/guest.schema";
import { UpdateOrderResType } from "@/schemaValidations/order.schema";
import { Minus, Plus } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";

export default function MenuOrder() {
  const { data } = useDishListQuery();
  const dishes = useMemo(() => data?.payload.data ?? [], [data]);
  const [orders, setOrders] = useState<GuestCreateOrdersBodyType>([]);
  const { mutateAsync } = useGuestOrderMutation();
  const router = useRouter();
  const totalPrice = useMemo(() => {
    return dishes.reduce((result, dish) => {
      const order = orders.find((order) => order.dishId === dish.id);
      if (!order) return result;
      return result + order.quantity * dish.price;
    }, 0);
  }, [dishes, orders]);
  const handleQuantityChange = (dishId: number, quantity: number) => {
    setOrders((prevOrders) => {
      if (quantity === 0) {
        return prevOrders.filter((order) => order.dishId !== dishId);
      }
      const index = prevOrders.findIndex((order) => order.dishId === dishId);
      if (index === -1) {
        return [...prevOrders, { dishId, quantity }];
      }
      const newOrders = [...prevOrders];
      newOrders[index] = { ...newOrders[index], quantity };
      return newOrders;
    });
  };

  const handleOrder = async () => {
    try {
      await mutateAsync(orders);
      router.push("/guest/orders");
    } catch (error) {
      handleErrorApi({ error });
    }
  };



  return (
    <>
      {dishes
        .filter((dish) => dish.status !== DishStatus.Hidden)
        .map((dish) => (
          <div
            key={dish.id}
            className={`flex gap-4  ${
              dish.status === DishStatus.Unavailable
                ? "pointer-events-none"
                : ""
            }`}
          >
            <div className="flex-shrink-0 relative">
              {dish.status === DishStatus.Unavailable && (
                <>
                  <span className="absolute inset-0 bg-black bg-opacity-80"></span>
                  <span className="absolute inset-0 flex items-center justify-center text-sm text-white">
                    Hết hàng
                  </span>
                </>
              )}
              <Image
                src={dish.image}
                alt={dish.name}
                height={100}
                width={100}
                quality={100}
                className="object-cover w-[80px] h-[80px] rounded-md"
              />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm">{dish.name}</h3>
              <p className="text-xs">{dish.description}</p>
              <p className="text-xs font-semibold">
                {formatCurrency(dish.price)}
              </p>
            </div>
            <div className="flex-shrink-0 ml-auto flex justify-center items-center">
              <div className="flex gap-1 ">
                {dish.status === DishStatus.Available && (
                  <Quantity
                    onChange={(value) => handleQuantityChange(dish.id, value)}
                    value={
                      orders.find((order) => order.dishId === dish.id)
                        ?.quantity ?? 0
                    }
                  />
                )}
              </div>
            </div>
          </div>
        ))}
      <div className="sticky bottom-0">
        <Button
          className="w-full justify-between"
          onClick={handleOrder}
          disabled={orders.length === 0}
        >
          <span>Đặt hàng · {orders.length} món</span>
          <span>{formatCurrency(totalPrice)}</span>
        </Button>
      </div>
    </>
  );
}
