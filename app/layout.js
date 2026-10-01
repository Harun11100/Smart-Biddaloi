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
  title: "বারেন্ডা সবুজ কানন স্কুল এন্ড কলেজ",

  description:
    "বারেন্ডা সবুজ কানন স্কুল এন্ড কলেজ — মানসম্মত শিক্ষা, নৈতিক মূল্যবোধ, সৃজনশীলতা ও আধুনিক শিক্ষার মাধ্যমে শিক্ষার্থীদের উজ্জ্বল ভবিষ্যৎ গড়ে তোলার প্রত্যয়ে পরিচালিত একটি শিক্ষাপ্রতিষ্ঠান।",

  keywords: [
    "বারেন্ডা সবুজ কানন স্কুল এন্ড কলেজ",
    "বারেন্ডা সবুজ কানন স্কুল",
    "বারেন্ডা সবুজ কানন",
    "Barenda Sabuj Kanan School and College",
    "Barenda Sabuj Kanan School",
    "Barenda School",
    "School in Barenda",
    "School in Kashimpur",
    "School in Gazipur",
    "School in Bangladesh",
    "Quality Education",
    "Primary Education",
    "Secondary Education",
    "Higher Secondary Education",
    "Meritorious Students",
    "Teachers",
    "Facilities",
    "Admissions",
  ],

  authors: [
    {
      name: "বারেন্ডা সবুজ কানন স্কুল এন্ড কলেজ",
      url: "https://barendasobujkanonschool.com",
    },
  ],

  openGraph: {
    title: "বারেন্ডা সবুজ কানন স্কুল এন্ড কলেজ",

    description:
      "মানসম্মত শিক্ষা, নৈতিক মূল্যবোধ ও আধুনিক শিক্ষার মাধ্যমে শিক্ষার্থীদের উজ্জ্বল ভবিষ্যৎ গড়ে তোলা।",

    type: "website",

    url: "https://barendasobujkanonschool.com",

    siteName: "বারেন্ডা সবুজ কানন স্কুল এন্ড কলেজ",

    locale: "bn_BD",

    images: [
      {
        url: "/icon.png",
        width: 1200,
        height: 630,
        alt: "বারেন্ডা সবুজ কানন স্কুল এন্ড কলেজ",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title: "বারেন্ডা সবুজ কানন স্কুল এন্ড কলেজ",

    description:
      "মানসম্মত শিক্ষা, নৈতিক মূল্যবোধ ও আধুনিক শিক্ষার মাধ্যমে শিক্ষার্থীদের উজ্জ্বল ভবিষ্যৎ গড়ে তোলা।",

    images: ["/icon.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="bn">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
