import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AccountProvider } from "@/providers/AccountProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Fil+",
  description: "A dashboard managing your Fil+ applications",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AccountProvider>
          <TooltipProvider>{children}</TooltipProvider>
          <Toaster />
        </AccountProvider>
      </body>
    </html>
  );
}
