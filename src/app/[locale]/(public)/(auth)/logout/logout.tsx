"use client";
import { useLogoutMutation } from "@/app/[locale]/queries/useAuth";
import { useAppStore } from "@/components/app-provider";
import {
  getAccessTokenFromLocalStorage,
  getRefreshTokenFromLocalStorage,
} from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/navigation";
import React, { useEffect, useRef } from "react";

function Logout() {
  const { mutateAsync } = useLogoutMutation();

  const disconnectSocket = useAppStore((state) => state.disconnectSocket);
  const setRole = useAppStore((state) => state.setRole);
  const router = useRouter();
  const ref = useRef<any>(null);
  const searchParams = useSearchParams();
  const refreshTokenFromUrl = searchParams.get("refreshToken");
  const accessTokenFromUrl = searchParams.get("accessToken");
  useEffect(() => {
    if (
      !ref.current ||
      refreshTokenFromUrl ||
      accessTokenFromUrl ||
      (refreshTokenFromUrl &&
        refreshTokenFromUrl === getRefreshTokenFromLocalStorage()) ||
      (accessTokenFromUrl &&
        accessTokenFromUrl === getAccessTokenFromLocalStorage())
    ) {
      ref.current = mutateAsync().then((res) => {
        setTimeout(() => {
          ref.current = null;
        }, 1000);
        setRole();
        disconnectSocket();
        router.push("login");
      });
    } else {
      router.push("/");
    }
  }, [
    mutateAsync,
    router,
    refreshTokenFromUrl,
    accessTokenFromUrl,
    setRole,
    disconnectSocket,
  ]);

  return <div>Log out...</div>;
}

export default Logout;
