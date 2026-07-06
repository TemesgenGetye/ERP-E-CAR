import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import RoleRedirect from "@/components/RoleRedirect";
import { cookies } from "next/headers";
import Protected from "./Protected";
import Providers from "./Providers";

export const metadata: Metadata = {
  title: "Hulucars",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const hasAccessToken = !!cookieStore.get("access")?.value;
  const hasRefreshToken = !!cookieStore.get("refresh")?.value;
  const isLogged = hasAccessToken || hasRefreshToken;

  return (
    <html lang="en">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
      </head>
      <body>
        <div className="root">
          <Protected isLogged={isLogged}>
            <Providers>
              {/* sidebar */}
              <Sidebar />
              <main className="flex-1 md:ml-20 overflow-y-auto max-h-screen px-3 md:px-4 pb-20 md:pb-4 bg-background pt-20">
                <Header />
                <div className="root">{children}</div>
              </main>
              <Toaster />
            </Providers>
          </Protected>
        </div>
      </body>
    </html>
  );
}
