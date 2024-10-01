import Logout from "@/app/[locale]/(public)/(auth)/logout/logout";
import { Metadata } from "next";
import React, { Suspense } from "react";

export const metadata: Metadata = {
  title: "Logout Redirect",
  description: "Logout Redirect",
  robots: {
    index: false,
  },
};

const LogoutPage = () => {
  return (
    <Suspense>
      <Logout />
    </Suspense>
  );
};

export default LogoutPage;
