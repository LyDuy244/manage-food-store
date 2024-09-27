"use client";
import { useLogoutMutation } from "@/app/queries/useAuth";
import { useAppContext } from "@/components/app-provider";
import {
  getAccessTokenFromLocalStorage,
  getRefreshTokenFromLocalStorage,
} from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useRef } from "react";

function Logout() {
  const { mutateAsync } = useLogoutMutation();
  const { setRole, socket, setSocket, disconnectSocket } = useAppContext();
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

const LogoutPage = () => {
  return (
    <Suspense>
      <Logout />
    </Suspense>
  );
};

export default LogoutPage;
