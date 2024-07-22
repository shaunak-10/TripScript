import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
import { Providers } from "./providers";
import NavbarComponent from "@/components/navbar";

const myFont = localFont({ src: "../../public/Poppins.ttf" });

export const metadata: Metadata = {
  title: "TripScriptt",
  description: "One stop destination for all your travel needs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={myFont.className}>
        <Providers>
          <NavbarComponent />
          {children}
        </Providers>
      </body>
    </html>
  );
}
