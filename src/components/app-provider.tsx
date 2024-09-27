"use client";
import ListenLogoutSocket from "@/components/listenLogoutSocket";
import RefreshToken from "@/components/refresh-token";
import envConfig from "@/config";
import { generateSocketInstance } from "@/lib/socket";
import {
  decodeToken,
  getAccessTokenFromLocalStorage,
  removeTokensFromLocalStorage,
} from "@/lib/utils";
import { RoleType } from "@/types/jwt.types";
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
// staleTime: thời gian data còn mới => hết thời gian tanstack mặc định là data cũ và fetch lại data
// gc: (5 phút) thời gian data sẽ bị xóa  đi
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { io, type Socket } from "socket.io-client";
const AppContext = createContext({
  role: undefined as RoleType | undefined,
  setRole: (role?: RoleType | undefined) => {},
  isAuth: false,
  socket: undefined as Socket | undefined,
  setSocket: (socket?: Socket | undefined) => {},
  disconnectSocket: () => {},
});

export const useAppContext = () => {
  return useContext(AppContext);
};

export default function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [socket, setSocket] = useState<Socket | undefined>(undefined);
  const [role, setRoleState] = useState<RoleType | undefined>();
  const count = useRef(0);
  useEffect(() => {
    if (count.current === 0) {
      const accessToken = getAccessTokenFromLocalStorage();
      if (accessToken) {
        const role = decodeToken(accessToken).role;
        setRoleState(role);
        setSocket(generateSocketInstance(accessToken));
      }
      count.current++;
    }
  }, []);

  const disconnectSocket = useCallback(() => {
    socket?.disconnect();
    setSocket(undefined);
  }, [socket, setSocket]);

  const setRole = useCallback((role?: RoleType | undefined) => {
    setRoleState(role);
    if (!role) {
      removeTokensFromLocalStorage();
    }
  }, []);
  const isAuth = Boolean(role);

  return (
    // Provide the client to your App
    <AppContext.Provider
      value={{ role, setRole, isAuth, socket, setSocket, disconnectSocket }}
    >
      <QueryClientProvider client={queryClient}>
        {children}
        <RefreshToken />
        <ListenLogoutSocket />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </AppContext.Provider>
  );
}
