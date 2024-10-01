import RefreshToken from "@/components/refresh-token";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Refresh token redirect",
  description: "Refresh token redirect",
  robots: {
    index: false,
  },
};

const RefreshTokenPage = () => {
  return (
    <Suspense>
      <RefreshToken />
    </Suspense>
  );
};

export default RefreshTokenPage;
