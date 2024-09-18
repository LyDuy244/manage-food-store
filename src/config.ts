import { z } from "zod";

const configSchema = z.object({
    NEXT_PUBLIC_API_ENDPOINT: z.string(),
    NEXT_PUBLIC_URL: z.string(),
})

// safeParse: kiểm tra xem có validate đúng với schema không
const configProject = configSchema.safeParse({
    NEXT_PUBLIC_API_ENDPOINT: process.env.NEXT_PUBLIC_API_ENDPOINT,
    NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL
})

if (!configProject.success) {
    console.error(configProject.error.errors)
    throw new Error("Các khai báo biến môi trường không hơp lệ")
}

const envConfig = configProject.data

export default envConfig