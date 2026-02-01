import type { Metadata } from "next";
import { TRPCProvider } from "@/api/client";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Video Text Overlay Editor Challenge",
  description: "A challenge for building interactive video editing features",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full max-h-screen w-full overflow-hidden font-sans antialiased">
        <TRPCProvider>
          <TooltipProvider>
            {children}
            <Toaster position="top-center" />
          </TooltipProvider>
        </TRPCProvider>
      </body>
    </html>
  );
}
