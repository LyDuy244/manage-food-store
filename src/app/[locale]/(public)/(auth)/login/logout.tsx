"use client";
import { useLogoutMutation } from "@/app/[locale]/queries/useAuth";
import { useAppStore } from "@/components/app-provider";
import {
  getAccessTokenFromLocalStorage,
  getRefreshTokenFromLocalStorage,
} from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/routing";
import React, { memo, Suspense, useEffect, useRef } from "react";

function LogoutComponent() {
  const { mutateAsync } = useLogoutMutation();
  const router = useRouter();
  const disconnectSocket = useAppStore((state) => state.disconnectSocket);
  const setRole = useAppStore((state) => state.setRole);
  const ref = useRef<any>(null);
  const searchParams = useSearchParams();
  const refreshTokenFromUrl = searchParams.get("refreshToken");
  const accessTokenFromUrl = searchParams.get("accessToken");
  useEffect(() => {
    if (
      (!ref.current &&
        refreshTokenFromUrl &&
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
      });
    } else if (accessTokenFromUrl !== getAccessTokenFromLocalStorage()) {
      router.push("/");
    }
  }, [
    mutateAsync,
    refreshTokenFromUrl,
    accessTokenFromUrl,
    setRole,
    disconnectSocket,
    router,
  ]);

  return null;
}

const Logout = memo(function LogoutInner() {
  return (
    <Suspense>
      <LogoutComponent></LogoutComponent>
    </Suspense>
  );
});

export default Logout;
