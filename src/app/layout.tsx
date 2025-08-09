import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import { cn } from "@/lib/utils";

import { TRPCReactProvider } from "@/trpc/client";

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
        <NuqsAdapter>
          <TRPCReactProvider>
            {children}
            <Toaster position="top-center" />
          </TRPCReactProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
