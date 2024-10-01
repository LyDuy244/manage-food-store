import Oauth from "@/app/[locale]/(public)/(auth)/login/oauth/oauth";
import { Metadata } from "next";
import React, { Suspense } from "react";
export const metadata: Metadata = {
  title: "Google Login Redirect",
  description: "Google Login Redirect",
  robots: {
    index: false,
  },
};
export default function OAuthPage() {
  return (
    <Suspense>
      <Oauth />
    </Suspense>
  );
}
