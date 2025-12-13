'use client';

import Menu from "@/app/components/admin/sidebar/Menu";
import Navbar from "@/app/components/Navbar";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  
  // If slug could be an array, pick the first one or default to empty string
  const slug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug ?? "";

  return (
    <div className="h-screen flex overflow-hidden bg-[#f8fbff]">
      <aside className="w-[15%] md:w-[10%] lg:w-[16%] xl:w-[14%] bg-white border-r border-gray-200 flex flex-col shadow-sm">
        <div className="p-4 sticky top-0 bg-white z-20 flex items-center justify-center lg:justify-start gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/smartbiddaloy.png" alt="logo" width={48} height={48} />
            <span className="hidden lg:block font-bold text-gray-800">
              Smart Biddaloy
            </span>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto px-2 pb-8 pt-0 custom-scrollbar">
          <Menu slug={slug} />
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-y-auto">
        <Navbar />
        <div className="px-4 py-4">{children}</div>
      </main>
    </div>
  );
}
