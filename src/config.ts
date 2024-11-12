import { z } from "zod";

const configSchema = z.object({
    NEXT_PUBLIC_API_ENDPOINT: z.string(),
    NEXT_PUBLIC_URL: z.string(),
    NEXT_PUBLIC_GOOGLE_AUTHORIZED_REDIRECT_URI: z.string(),
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: z.string(),
    NEXT_PUBLIC_INITIAL_EMAIL_OWNER: z.string(),
    NEXT_PUBLIC_INITIAL_PASSWORD_OWNER: z.string()
})

// safeParse: kiểm tra xem có validate đúng với schema không
const configProject = configSchema.safeParse({
    NEXT_PUBLIC_API_ENDPOINT: process.env.NEXT_PUBLIC_API_ENDPOINT,
    NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,
    NEXT_PUBLIC_GOOGLE_AUTHORIZED_REDIRECT_URI: process.env.NEXT_PUBLIC_GOOGLE_AUTHORIZED_REDIRECT_URI,
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    NEXT_PUBLIC_INITIAL_EMAIL_OWNER: process.env.NEXT_PUBLIC_INITIAL_EMAIL_OWNER,
    NEXT_PUBLIC_INITIAL_PASSWORD_OWNER: process.env.NEXT_PUBLIC_INITIAL_PASSWORD_OWNER
})

if (!configProject.success) {
    console.error(configProject.error.errors)
    throw new Error("Các khai báo biến môi trường không hơp lệ")
}

const envConfig = configProject.data

export default envConfig


export type Locale = (typeof locales)[number];
export const locales = ['en', 'vi'] as const;
export const defaultLocale: Locale = 'vi'