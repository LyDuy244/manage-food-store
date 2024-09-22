"use client";
import {
  checkAndRefreshToken,
  getRefreshTokenFromLocalStorage,
} from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useRef } from "react";

function RefreshToken ( ) {
  const router = useRouter();
  const ref = useRef<any>(null);
  const searchParams = useSearchParams();
  const refreshTokenFromUrl = searchParams.get("refreshToken");
  const redirect = searchParams.get("redirect");
  useEffect(() => {
    if (
      refreshTokenFromUrl &&
      refreshTokenFromUrl === getRefreshTokenFromLocalStorage()
    ) {
      checkAndRefreshToken({
        onSuccess: () => {
          router.push(redirect || "/");
        },
      });
    } else {
      router.push("/");
    }
  }, [redirect, refreshTokenFromUrl, router]);

  return <div>Refresh Token...</div>
}

const RefreshTokenPage = () => {
  

  return <Suspense>
    <RefreshToken/>
  </Suspense>;
};

export default RefreshTokenPage;
