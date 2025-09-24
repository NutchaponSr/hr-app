import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import { cn } from "@/lib/utils";

import { TRPCReactProvider } from "@/trpc/client";

import { Toaster } from "@/components/ui/sonner";

import { SheetProvider } from "@/providers/sheet-provider";
import { ThemeProvider } from "@/providers/theme-provider";

import "./globals.css";
import { EdgeStoreProvider } from "@/lib/edegstore";

const font = Geist({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HR App",
  description: "Human Resources Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(font.className, "antialiased")}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          storageKey="hr-app-theme"
        >
          <TRPCReactProvider>
            <NuqsAdapter>
              <EdgeStoreProvider>
                {children}
                <SheetProvider />
                <Toaster richColors position="bottom-right" />
              </EdgeStoreProvider>
            </NuqsAdapter>
          </TRPCReactProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
