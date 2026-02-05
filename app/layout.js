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
  title: "Barenda F.Chan Academy",
  description:
    "A premier educational institution fostering excellence and holistic development.",
  keywords: [
    "Barenda F.Chan Academy",
    "Barenda School",
    "Barenda F Chan",
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
      name: "Barenda F.Chan Academy",
      url: "https://barendafchanacademy.com",
    },
  ],
  openGraph: {
    title: "Barenda F.Chan Academy",
    description:
      "A premier educational institution fostering excellence and holistic development.",
    type: "website",
    url: "https://barendafchanacademy.com",
    images: [
      {
        url: "/image1.jpg",
        width: 1200,
        height: 630,
        alt: "Barenda F.Chan Academy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Barenda F.Chan Academy",
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
