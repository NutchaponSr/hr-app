import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import { cn } from "@/lib/utils";

import { TRPCReactProvider } from "@/trpc/client";

import { SheetProvider } from "@/providers/sheet-provider";

import "./globals.css";

const font = Inter({
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
    <html lang="en">
      <body className={cn(font.className, "antialiased")}>
        <TRPCReactProvider>
          <NuqsAdapter>
            {children}
            <SheetProvider />
            <Toaster position="top-center" />
          </NuqsAdapter>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
