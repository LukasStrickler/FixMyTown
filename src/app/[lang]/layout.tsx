import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "@/trpc/react";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "../api/uploadthing/core";
import { AppSidebar } from "@/components/sidebar/app-sidebar"

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { AuthProvider } from "@/components/provider/authProvider";
import { Toaster } from "@/components/ui/toaster";

import NamePopup from "@/components/namePopup";

export const metadata: Metadata = {
  title: "FixMyTown",
  description: "Melden Sie Probleme in Ihrer Stadt",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // suppressHydrationWarning is needed to prevent hydration errors with the theme provider 
    // TODO: find a better solution / fix for prod
    <html className={GeistSans.variable}>
      <body className="min-h-screen">
        <AuthProvider>
          <TRPCReactProvider>
            <NamePopup />
            <SidebarProvider>
              <AppSidebar />
              <SidebarInset>
                <SidebarTrigger className="block md:hidden fixed top-1 left-1 z-50 bg-sidebar" />
                <NextSSRPlugin
                  /**
                   * The `extractRouterConfig` will extract **only** the route configs
                   * from the router to prevent additional information from being
                   * leaked to the client. The data passed to the client is the same
                   * as if you were to fetch `/api/uploadthing` directly.
                   */
                  routerConfig={extractRouterConfig(ourFileRouter)}
                />
                {children}
                <Toaster />
              </SidebarInset>
            </SidebarProvider>
          </TRPCReactProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
