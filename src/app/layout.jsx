import { DM_Sans, Instrument_Serif } from "next/font/google";
import Analytics from "@/components/Analytics";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: "400",
});

export const metadata = {
  title: "Dantel — Full-Stack Web Developer & Designer",
  description:
    "Independent, self-taught full-stack web developer building thoughtful digital products and resilient systems.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${instrumentSerif.variable}`}>
      <body>
        <Analytics />
        {children}
      </body>
    </html>
  );
}
