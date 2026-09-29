import type { Metadata } from "next";
import { Nunito_Sans, Fraunces } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AskSamira from "@/components/AskSamira";
import { TripProvider } from "@/lib/trip/TripProvider";
import { CurrencyProvider } from "@/lib/currency/CurrencyProvider";

const nunito = Nunito_Sans({ subsets: ["latin"], variable: "--font-sans" });
const fraunces = Fraunces({
  subsets: ["latin"],
  axes: ["opsz", "SOFT", "WONK"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "MaulyTours — Luxury Safaris, Tanzania & East Africa",
  description: "UI/UX prototype of MaulyTours' public site, rebuilt in Next.js.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${nunito.variable} ${fraunces.variable}`}>
      <body>
        <CurrencyProvider>
          <TripProvider>
            <Header />
            {children}
            <Footer />
            <AskSamira />
          </TripProvider>
        </CurrencyProvider>
      </body>
    </html>
  );
}
