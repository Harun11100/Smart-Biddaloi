'use client';

import Menu from "@/app/components/admin/sidebar/Menu";
import Navbar from "@/app/components/Navbar";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Layout({ children }) {
  const params = useParams();
  const router = useRouter();
  const [schoolData, setSchoolData] = useState(null);

  // Handle slug if array
  const slug = Array.isArray(params?.slug)
    ? params.slug[0]
    : params?.slug ?? "";

  const schoolId = schoolData?.schoolId ?? "";

  useEffect(() => {
    const stored = localStorage.getItem("schoolDetails");

    if (stored) {
      try {
        const school = JSON.parse(stored);

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
         <div className="p-4 sticky top-0 bg-white z-20 flex justify-center">
                 <Link
                   href="/"
                   className="flex flex-col items-center gap-2 lg:gap-3"
                 >
                   <Image
                     src="/icon.png"
                     alt="icon"
                     width={48}
                     height={48}
                     className="object-contain"
                   />
       
                   {/* School Name - only show on large & medium */}
                   <span className="hidden lg:block text-center font-bold text-gray-800 text-sm lg:text-lg">
                     Barenda Sobuj Kanon School & College
                   </span>
                 </Link>
               </div>

        {/* Menu */}
        <div className="flex-1 overflow-y-auto px-2 pb-8 pt-0 custom-scrollbar">
          <Menu slug={slug} schoolId={schoolId} />
        </div>
      </aside>

      {/* MAIN CONTENT */}
       {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-y-auto">
             {/* Sticky Navbar */}
              <div className="sticky top-0 z-30 bg-white">
                <Navbar />
              </div>
      
              {/* Page Content */}
              <div className="px-4 py-4 sm:px-6 md:px-10">
                {children}
              </div>
      </main>
    </div>
  );
}
