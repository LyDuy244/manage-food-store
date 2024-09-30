"use client";
import { useSetTokenToCookieMutation } from "@/app/[locale]/queries/useAuth";
import { useAppStore } from "@/components/app-provider";
import { toast } from "@/hooks/use-toast";
import { generateSocketInstance } from "@/lib/socket";
import { decodeToken } from "@/lib/utils";
import { useRouter } from "@/navigation";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useRef } from "react";

export default function OAuthPage() {
  const { mutateAsync } = useSetTokenToCookieMutation();
  const count = useRef(0);
  const router = useRouter();
  const setSocket = useAppStore((state) => state.setSocket);
  const setRole = useAppStore((state) => state.setRole);

  const searchParams = useSearchParams();
  const accessToken = searchParams.get("accessToken");
  const refreshToken = searchParams.get("refreshToken");
  const message = searchParams.get("message");
  useEffect(() => {
    if (accessToken && refreshToken) {
      if (count.current === 0) {
        const { role } = decodeToken(accessToken);

        mutateAsync({ accessToken, refreshToken })
          .then(() => {
            setRole(role);
            setSocket(generateSocketInstance(accessToken));
            router.push("/manage/dashboard");
          })
          .catch((e) => {
            toast({ description: e.message || "Có lỗi xảy ra" });
          });

        count.current++;
      }
    } else {
      if (count.current === 0) {
        setTimeout(() => {
          toast({ description: message || "Có lỗi xảy ra" });
        });
        count.current++;
      }
    }
  }, [
    accessToken,
    message,
    mutateAsync,
    refreshToken,
    router,
    setRole,
    setSocket,
  ]);

  return <div>OAuthPage</div>;
}
