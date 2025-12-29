"use client"
import React from "react";
import {UserButton} from "@daveyplate/better-auth-ui";
import{Sidebar,SidebarContent,SidebarFooter,SidebarGroup,SidebarGroupContent,SidebarGroupLabel,SidebarMenu} from "~/components/ui/sidebar";
import {User,Sparkles,Settings} from "lucide-react";
import Link from "next/link";
const AppSidebar =async () => {
  return (
    <Sidebar className="from-background to-muted/20 border-r-0 bg-gradient-to-b">
      <SidebarContent className="px-3">
        <SidebarGroup>
          <SidebarGroupLabel className="text-primary mt-6 mb-8 flex flex-col items-start justify-start px-3">
            <Link href="/" className="mb-1 flex cursor-pointer items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              <p className="from-primary to-primary/70 bg-gradient-to-r bg-clip-text  text-2xl
              font-bold tracking-tight text-transparent">AI voice</p>
            </Link>
            <p className="from-muted-foreground ml-8 text-sm font-medium tracking-while">Studio</p>
          </SidebarGroupLabel>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
