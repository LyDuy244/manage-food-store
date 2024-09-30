import Layout from "@/app/[locale]/(public)/layout";
import { defaultLocale } from "@/config";

export default function GuestLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <Layout params={{ locale: defaultLocale }} modal={null}>
      {children}
    </Layout>
  );
}
