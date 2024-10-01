"use client";

import { useLogoutMutation } from "@/app/[locale]/queries/useAuth";
import { useGuestLogoutMutation } from "@/app/[locale]/queries/useGuest";
import { useAppStore } from "@/components/app-provider";
import { Role } from "@/constants/type";
import {
  cn,
  getAccessTokenFromLocalStorage,
  handleErrorApi,
} from "@/lib/utils";
import { RoleType } from "@/types/jwt.types";
import { Link } from "@/navigation";
import { useRouter } from "@/navigation";
import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
const menuItems: {
  title: string;
  href: string;
  role?: RoleType[];
  hideWhenLogin?: Boolean;
}[] = [
  {
    title: "home",
    href: "/",
  },
  {
    title: "menu",
    href: "/guest/menu",
    role: [Role.Guest],
  },
  {
    title: "orders",
    href: "/guest/orders",
    role: [Role.Guest],
  },
  {
    title: "login",
    href: "/login",
    hideWhenLogin: true,
  },
  {
    title: "manage",
    href: "/manage/dashboard",
    role: [Role.Owner, Role.Employee],
  },
];

// Server: Món ăn, Đăng nhập. Do server không biết trạng thái đăng nhập của user
// Client: Đầu tiên client hiển thị là Món ăn, Đăng nhập. Nhưng ngay sau đó client render ra Món ăn Đơn hàng, Quản lý do check được trạng thái đăng nhập của user

export default function NavItems({ className }: { className?: string }) {
  const t = useTranslations("NavItem");
  const role = useAppStore((state) => state.role);
  const setRole = useAppStore((state) => state.setRole);
  const disconnectSocket = useAppStore((state) => state.disconnectSocket);

  const ownerLogoutMutation = useLogoutMutation();
  const guestLogoutMutation = useGuestLogoutMutation();
  const logoutMutation =
    role === Role.Guest ? guestLogoutMutation : ownerLogoutMutation;
  const router = useRouter();

  const logout = async () => {
    if (logoutMutation.isPending) return;
    try {
      await logoutMutation.mutateAsync();
      setRole();
      disconnectSocket();
      router.push("/");
    } catch (error) {
      handleErrorApi({ error });
    }
  };
  return (
    <>
      {menuItems.map((item) => {
        // Trường hợp đăng nhập thì chỉ hiển thị menu đăng nhập
        const isAuth = item.role && role && item.role.includes(role);

        // Trường hợp menu item có thể hiển thị dù cho đăng nhập hay chưa
        const canShow =
          (item.role === undefined && !item.hideWhenLogin) ||
          (!role && item.hideWhenLogin);
        if (isAuth || canShow)
          return (
            <Link href={item.href} key={item.href} className={className}>
              {t(item.title as any)}
            </Link>
          );
        return null;
      })}
      {role && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <div className={cn(className, "cursor-pointer")}>Đăng xuất</div>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Bạn có muốn đăng xuất không?</AlertDialogTitle>
              <AlertDialogDescription>
                Việc đăng xuất có thể làm mất đi hóa đơn của bạn!
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={logout}>Thoát</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}
