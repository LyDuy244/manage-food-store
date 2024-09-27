import envConfig from "@/config"
import { io } from "socket.io-client"

export const generateSocketInstance = (accessToken: string) => {
    return io(envConfig.NEXT_PUBLIC_API_ENDPOINT, {
        auth: {
            Authorization: `Bearer ${accessToken}`,
        },
        transports: ["websocket"],
    })
}