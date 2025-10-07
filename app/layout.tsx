import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { cookies } from "next/headers";
import Protected from "./Protected";

export const metadata: Metadata = {
  title: "E-Car-ERP",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const isLogged = !!cookieStore.get("access")?.value;
  console.log(cookieStore.get("access")?.value);
  console.log("authenticated", isLogged);

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
            <>
              {/* sidebar */}
              <Sidebar />
              <main className="flex-1 ml-16 overflow-y-auto max-h-screen p-4 py-0 bg-white pt-20">
                <Header />
                <div className="root">{children}</div>
              </main>
            </>
          </Protected>
        </div>
      </body>
    </html>
  );
}
