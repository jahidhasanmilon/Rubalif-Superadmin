import type { Metadata } from "next";
import { Inter, Tiro_Bangla } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-inter",
});

const tiroBangla = Tiro_Bangla({
  subsets: ["bengali"],
  weight: "400",
  variable: "--font-tiro-bangla",
});

export const metadata: Metadata = {
  title: "Rubalif Superadmin",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${tiroBangla.variable}`}>
      <body>{children}</body>
    </html>
  );
}
