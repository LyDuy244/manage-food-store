"use client";
import React, { Suspense } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLocale, useTranslations } from "next-intl";
import { Locale, locales } from "@/config";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

function SwitchLanguageMain() {
  const t = useTranslations("SwitchLanguage");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  return (
    <Select
      value={locale}
      onValueChange={(value) => {
        const locale = params.locale as Locale;
        const newPathName = pathname.replace(`/${locale}`, `/${value}`);
        const fullUrl = `${newPathName}?${searchParams.toString()}`;
        router.replace(fullUrl);
        router.refresh();
      }}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={t("title")} />
      </SelectTrigger>
      <SelectContent>
        {locales.map((locale) => (
          <SelectItem value={locale} key={locale}>
            {t(locale)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default function SwitchLanguage() {
  return (
    <Suspense>
      <SwitchLanguageMain />
    </Suspense>
  );
}
