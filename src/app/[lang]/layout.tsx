// Styles
import "@/styles/globals.css";

// External Libraries
import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { extractRouterConfig } from "uploadthing/server";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";

// Components
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster";
import NamePopup from "@/components/namePopup";

// Providers
import { TRPCReactProvider } from "@/trpc/react";
import { AuthProvider } from "@/components/provider/authProvider";
import { ThemeProvider } from "@/components/provider/themeProvider";
import { ourFileRouter } from "../api/uploadthing/core";

// Metadata
export const metadata: Metadata = {
  title: "FixMyTown",
  description: "Melden Sie Probleme in Ihrer Stadt",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

type Props = {
  children: React.ReactNode;
  params: {
    lang: string;
  };
};

export default function LangLayout({
  children,
  params: { lang },
}: Readonly<Props>) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider>
        <TRPCReactProvider>
          <NamePopup />
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
              <SidebarTrigger className="block md:hidden fixed top-1 left-1 z-50 bg-sidebar" />
              <NextSSRPlugin
                routerConfig={extractRouterConfig(ourFileRouter)}
              />
              {children}
              <Toaster />
            </SidebarInset>
          </SidebarProvider>
        </TRPCReactProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
