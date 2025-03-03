import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WTR",
  description: "Weight training recorder",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="cupcake">
      <body>
        <main className="min-w-[375px] max-w-[650px] w-screen h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
