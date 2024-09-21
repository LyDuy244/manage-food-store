"use client";

import { useAppContext } from "@/components/app-provider";
import { getAccessTokenFromLocalStorage } from "@/lib/utils";
import Link from "next/link";
import { useEffect, useState } from "react";

const menuItems = [
  {
    title: "Món ăn",
    href: "/menu", // authRequired = undefined nghĩa là đăng nhập hay chưa đều cho hiển thị
  },
  {
    title: "Đơn hàng",
    href: "/orders",
    authRequired: true,
  },
  {
    title: "Đăng nhập",
    href: "/login",
    authRequired: false, // Khi false nghia là chưa đăng nhập sẽ hiển thị
  },
  {
    title: "Quản lý",
    href: "/manage/dashboard",
    authRequired: true, // true nghĩa là đăng nhập rồi mới hiển thị
  },
];

// Server: Món ăn, Đăng nhập. Do server không biết trạng thái đăng nhập của user
// Client: Đầu tiên client hiển thị là Món ăn, Đăng nhập. Nhưng ngay sau đó client render ra Món ăn Đơn hàng, Quản lý do check được trạng thái đăng nhập của user

export default function NavItems({ className }: { className?: string }) {
  const { isAuth } = useAppContext();

  return menuItems.map((item) => {
    if (
      (item.authRequired === false && isAuth) ||
      (item.authRequired === true && !isAuth)
    )
      return null;
    return (
      <Link href={item.href} key={item.href} className={className}>
        {item.title}
      </Link>
    );
  });
}
