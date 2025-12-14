'use client';

import Menu from "@/app/components/admin/sidebar/Menu";
import Navbar from "@/app/components/Navbar";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface SchoolData {
  schoolId: string;
  name?: string;
  [key: string]: any;
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const router = useRouter();
  const [schoolData, setSchoolData] = useState<SchoolData | null>(null);

  // Handle slug if array
  const slug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug ?? "";
  const schoolId = schoolData?.schoolId ?? "";
  useEffect(() => {
    const stored = localStorage.getItem("schoolDetails");
    if (stored) {
      try {
        const school: SchoolData = JSON.parse(stored);
        if (!school.schoolId) {
          router.push("/sign-in-as-admin");
          return;
        }
        setSchoolData(school);
      } catch (err) {
        console.error("Failed to parse schoolDetails from localStorage", err);
        router.push("/sign-in-as-admin");
      }
    } else {
      router.push("/sign-in-as-admin");
    }
  }, [router]);

  return (
    <div className="h-screen flex overflow-hidden bg-[#f8fbff]">
      {/* SIDEBAR */}
      <aside className="w-[15%] md:w-[12%] lg:w-[16%] xl:w-[14%] bg-white border-r border-gray-200 flex flex-col shadow-sm">
        {/* Logo */}
        <div className="p-4 sticky top-0 bg-white z-20 flex items-center justify-center lg:justify-start gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/smartbiddaloy.png"
              alt="logo"
              width={48}
              height={48}
              className="object-contain"
            />
            <span className="hidden lg:block font-bold text-gray-800 text-lg">
              Smart Biddaloy
            </span>
          </Link>
        </div>

        {/* Menu */}
        <div className="flex-1 overflow-y-auto px-2 pb-8 pt-0 custom-scrollbar">
          <Menu slug={slug} schoolId={schoolId} />
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        <Navbar />
        <div className="px-4 py-4 sm:px-6 sm:py-6 md:px-10 md:py-8">{children}</div>
      </main>
    </div>
  );
}
