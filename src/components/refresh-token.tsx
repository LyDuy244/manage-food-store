"use client";
import { checkAndRefreshToken } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

// Những page không check refresh token
const UNAUTHENTICATED_PATH = ["/login", "register", "refresh-token"];
export default function RefreshToken() {
  const pathname = usePathname();
  const router = useRouter();
  useEffect(() => {
    if (UNAUTHENTICATED_PATH.includes(pathname)) return;
    let interval: any = null;

    // Phải gọi lần đầu tiên, vì interval sẽ chạy sau thời gian TIMEOUT
    checkAndRefreshToken({
      onError: () => {
        clearInterval(interval);
        router.push("/login");
      },
    });
    // Timeout interval phải bé hơn thời gian hết hạn access token
    // ví thời gian hết hạn accessToken = 10s thì timeout = 1s
    const TIMEOUT = 1000;
    interval = setInterval(() => {
      checkAndRefreshToken({
        onError: () => {
          clearInterval(interval);
          router.push("/login");
        },
      });
    }, TIMEOUT);

    return () => clearInterval(interval);
  }, [pathname, router]);
  return null;
}
