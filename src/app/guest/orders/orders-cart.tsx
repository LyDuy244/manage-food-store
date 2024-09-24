"use client";
import { useGuestGetOrderListQuery } from "@/app/queries/useGuest";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import socket from "@/lib/socket";
import { formatCurrency, getVietnameseOrderStatus } from "@/lib/utils";
import { UpdateOrderResType } from "@/schemaValidations/order.schema";
import Image from "next/image";
import React, { useEffect, useMemo } from "react";

export default function OrdersCart() {
  const { data, refetch } = useGuestGetOrderListQuery();
  const orders = useMemo(() => data?.payload.data ?? [], [data]);
  const totalPrice = useMemo(() => {
    return orders.reduce((result, order) => {
      return result + order.quantity * order.dishSnapshot.price;
    }, 0);
  }, [orders]);

  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }
    function onConnect() {
      console.log(socket.id);
    }

    function onDisconnect() {
      console.log("disconnect");
    }
    function onUpdateOrder(data: UpdateOrderResType["data"]) {
      const { dishSnapshot, quantity } = data;
      toast({
        description: `Món ăn ${
          dishSnapshot.name
        } (SL: ${quantity}) vừa được cập nhật sang trạng thái "${getVietnameseOrderStatus(
          data.status
        )}"`,
      });
      refetch();
    }

    socket.on("update-order", onUpdateOrder);
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", (err) => {
      // the reason of the error, for example "xhr poll error"
      console.log(err.message);
    });
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("update-order", onUpdateOrder);
    };
  }, [refetch]);
  return (
    <>
      {orders.map((order, index) => (
        <div key={order.id} className="flex gap-4 items-start">
          <div className="text-xs font-semibold">{index + 1}</div>
          <div className="flex-shrink-0 relative">
            <Image
              src={order.dishSnapshot.image}
              alt={order.dishSnapshot.name}
              height={100}
              width={100}
              quality={100}
              priority={true}
              className="object-cover w-[80px] h-[80px] rounded-md"
            />
          </div>
          <div className="space-y-2 flex-1">
            <h3 className="text-sm">{order.dishSnapshot.name}</h3>
            <div className="text-xs font-semibold flex items-center justify-between">
              {formatCurrency(order.dishSnapshot.price)} <span>x</span>
              <span>{order.quantity}</span>
            </div>
            <div className="flex-shrink-0">
              <Badge>{getVietnameseOrderStatus(order.status)}</Badge>
            </div>
          </div>
        </div>
      ))}
      <div className="sticky bottom-0 ">
        <div className="w-full flex gap-4 text-lg font-semibold">
          <span>Tổng cộng · {orders.length} món</span>
          <span>{formatCurrency(totalPrice)}</span>
        </div>
      </div>
    </>
  );
}
