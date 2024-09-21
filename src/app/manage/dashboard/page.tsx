import accountApiRequest from "@/apiRequests/account";
import { cookies } from "next/headers";
import React from "react";

const page = async () => {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken")?.value as string;
  let name = "";

  try {
    const result = await accountApiRequest.sMe(accessToken);
    name = result.payload.data.name;
  } catch (error: any) {
    if (error.digest?.includes("NEXT_DIRECT")) {
      throw error;
    }
  }

  return <div>dashboard {name}</div>;
};

export default page;
