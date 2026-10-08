"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Navbar = ({ admin = "Admin User" }) => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("schoolDetails");
    localStorage.removeItem("schoolData");
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/80 transition-colors">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 sm:px-6 lg:px-8">
        
        {/* Brand / Logo */}
        <Link
          href="/"
          className="group flex items-center gap-3 rounded-xl p-1 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
        >
          <div className="relative flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-slate-100 p-1.5 shadow-sm ring-1 ring-slate-900/5 transition-transform duration-200 group-hover:scale-105 dark:bg-slate-800 dark:ring-white/10">
            <Image
              src="/icon.png"
              alt="School Logo"
              width={40}
              height={40}
              className="h-full w-full object-contain"
              priority
            />
          </div>

          <div className="flex flex-col">
            <span className="font-bold text-slate-900 text-sm sm:text-base tracking-tight dark:text-white leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              Barenda Sobuj Kanon
            </span>
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 hidden sm:block">
              School &amp; College Portal
            </span>
          </div>
        </Link>

        {/* Right Action Controls */}
        <div className="flex items-center gap-3 sm:gap-4">
          
          {/* Logout Action Button */}
          <button
            onClick={handleLogout}
            title="Logout"
            aria-label="Logout"
            className="group relative flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-rose-950/40 dark:hover:text-rose-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-rose-500/30 active:scale-95"
          >
            <svg
              className="h-5 w-5 transition-transform duration-200 group-hover:-translate-x-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </button>

          <div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-800 hidden sm:block" />

          {/* User Profile Info */}
          <div className="flex items-center gap-3 pl-1">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-snug">
                {admin}
              </span>
              <div className="flex items-center justify-end gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Administrator
                </span>
              </div>
            </div>

            {/* Avatar */}
            <div className="relative group cursor-pointer">
              <div className="h-10 w-10 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 shadow-sm transition-all duration-200 group-hover:ring-2 group-hover:ring-indigo-500/40 group-hover:scale-105">
                <Image
                  src="/avatar.png"
                  alt={admin}
                  width={40}
                  height={40}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>

        </div>

      </div>
    </header>
  );
};

export default Navbar;