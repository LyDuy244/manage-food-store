import { useLogoutMutation } from "@/app/queries/useAuth";
import { useAppContext } from "@/components/app-provider";
import { handleErrorApi } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";
const UNAUTHENTICATED_PATH = ["/login", "register", "refresh-token"];

export default function ListenLogoutSocket() {
  const pathname = usePathname();
  const { isPending, mutateAsync } = useLogoutMutation();
  const { setRole, socket, disconnectSocket } = useAppContext();
  const router = useRouter();

  useEffect(() => {
    if (UNAUTHENTICATED_PATH.includes(pathname)) return;
    async function onLogout() {
      if (isPending) return;
      try {
        await mutateAsync();
        setRole();
        disconnectSocket();
        router.push("/");
      } catch (error) {
        handleErrorApi({ error });
      }
    }
    socket?.on("logout", onLogout);
    return () => {
      socket?.off("logout", onLogout);
    };
  }, [disconnectSocket, isPending, mutateAsync, pathname, router, setRole, socket]);
  return null;
}
