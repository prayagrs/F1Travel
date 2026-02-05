import type { Metadata } from "next";
import { Nunito, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Header } from "@/ui/components/Header";
import { Footer } from "@/ui/components/Footer";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "F1 Travel - Your F1 Race Weekend Planner",
  description: "Plan your Formula 1 race weekend trip with flights, hotels, tickets, and experiences",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=block"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${nunito.variable} ${plusJakarta.variable} antialiased`}
      >
        <Providers>
          <Header />
          <main className="min-h-screen bg-[#0B0C0E] pb-28 sm:pb-32">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
