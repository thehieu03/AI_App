import "~/styles/globals.css";
import React from "react";
import { Providers } from "~/components/providers";
import { Toaster } from "~/components/ui/sonner";
import {
  SidebarInset,SidebarProvider,SidebarTrigger
} from "~/components/ui/sidebar";
import {Separator} from "~/components/ui/separator";

interface Props {
  children: React.ReactNode;
}

const RootLayout = ({ children }: Props) => {
  return (
    <Providers>
      <SidebarProvider>
        <SidebarTrigger>
          <SidebarInset className="flex h-screen flex-col">
            {children}
          </SidebarInset>
        </SidebarTrigger>
        {children}
      </SidebarProvider>
      <Toaster />
    </Providers>
  );
};

export default RootLayout;
