import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Orchard Point School & College",
  description:
    "A premier educational institution fostering excellence and holistic development.",
  keywords: [
    "Orchard",
    "Orchard School",
    "Orchard Point School",
    "School in Bangladesh",
    "Quality Education",
    "Primary Education",
    "Secondary Education",
    "Higher Secondary",
    "Meritorious Students",
    "Teachers",
    "Facilities",
    "Admissions",
  ],
  authors: [
    {
      name: "Orchard Point School & College",
      url: "https://orchardpoint.edu.bd",
    },
  ],
  openGraph: {
    title: "Orchard Point School & College",
    description:
      "A premier educational institution fostering excellence and holistic development.",
    type: "website",
    url: "https://orchardpoint.edu.bd",
    images: [
      {
        url: "/image1.jpg",
        width: 1200,
        height: 630,
        alt: "Orchard Point School & College",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Orchard Point School & College",
    description:
      "A premier educational institution fostering excellence and holistic development.",
    images: ["/image2.jpg"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
