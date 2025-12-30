import React from "react";
import { auth } from "~/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import CustomerPortalRedirect from "~/components/sidebar/CustomerPortalRedirect";

async function Page() {
  const session=await auth.api.getSession({
    headers:await headers()
  })
  if(!session){
    redirect("/auth/sign-in");
  }
  return <CustomerPortalRedirect />;
}

export default Page;
