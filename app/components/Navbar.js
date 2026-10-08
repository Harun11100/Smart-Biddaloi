"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  LogOut,
  Bell,
  ShieldCheck,
  ChevronDown,
  User,
  Settings,
  Sparkles,
} from "lucide-react";

const Navbar = ({
  admin = "Admin User",
  adminEmail = "admin@barendasobujkanon.edu.bd",
  unreadNotificationsCount = 3,
}) => {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("schoolDetails");
    localStorage.removeItem("schoolData");
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-100 bg-white shadow-xs">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 sm:px-6 lg:px-8">
        {/* Brand / Logo */}
        <Link
          href="/"
          className="group flex items-center gap-3.5 rounded-2xl p-1 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
        >
          <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200/80 bg-slate-50 p-2 shadow-xs transition-all duration-300 group-hover:scale-105 group-hover:bg-slate-100">
            <Image
              src="/icon.png"
              alt="School Logo"
              width={40}
              height={40}
              className="h-full w-full object-contain transition-transform duration-300 group-hover:rotate-3"
              priority
            />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-base font-extrabold tracking-tight text-slate-900 transition-colors group-hover:text-indigo-600">
                Barenda Sobuj Kanon
              </span>
              <span className="hidden rounded-md bg-indigo-50 px-1.5 py-0.5 text-[10px] font-bold text-indigo-600 lg:inline-block">
                PRO
              </span>
            </div>
            <span className="text-xs font-medium text-slate-500">
              School &amp; College Portal
            </span>
          </div>
        </Link>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Notifications Button */}
          <button
            type="button"
            title="Notifications"
            aria-label="View Notifications"
            className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition-all duration-200 hover:bg-slate-200/70 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 active:scale-95"
          >
            <Bell size={18} />
            {unreadNotificationsCount > 0 && (
              <span className="absolute right-2 top-2 flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-rose-500" />
              </span>
            )}
          </button>

          {/* Quick Logout Button (Desktop View) */}
          <button
            onClick={handleLogout}
            title="Quick Logout"
            aria-label="Logout"
            className="group hidden h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition-all duration-200 hover:bg-rose-50 hover:text-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-500/30 active:scale-95 sm:flex"
          >
            <LogOut
              size={18}
              className="transition-transform duration-200 group-hover:-translate-x-0.5"
            />
          </button>

          <div className="mx-1 hidden h-6 w-[1px] bg-slate-200 sm:block" />

          {/* User Profile Dropdown Menu */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              aria-expanded={isDropdownOpen}
              aria-haspopup="true"
              className="group flex items-center gap-2.5 rounded-2xl p-1 transition-all duration-200 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            >
              {/* Avatar Container */}
              <div className="relative h-10 w-10 overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-xs transition-all duration-200 group-hover:ring-2 group-hover:ring-indigo-500/40">
                <Image
                  src="/avatar.png"
                  alt={admin}
                  width={40}
                  height={40}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
                <div className="flex h-full w-full items-center justify-center text-slate-400">
                  <User size={20} />
                </div>
              </div>

              {/* Text Info */}
              <div className="hidden flex-col text-left sm:flex">
                <span className="text-xs font-bold leading-tight text-slate-800">
                  {admin}
                </span>
                <div className="mt-0.5 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Administrator
                  </span>
                </div>
              </div>

              <ChevronDown
                size={14}
                className={`hidden text-slate-400 transition-transform duration-200 sm:block ${
                  isDropdownOpen ? "rotate-180 text-indigo-600" : ""
                }`}
              />
            </button>

            {/* Popover Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 origin-top-right rounded-2xl border border-slate-100 bg-white p-1.5 shadow-xl ring-1 ring-slate-900/5 transition-all">
                {/* Header Section */}
                <div className="border-b border-slate-100 px-3 py-2.5">
                  <p className="text-xs font-bold text-slate-900">
                    {admin}
                  </p>
                  <p className="truncate text-[11px] font-medium text-slate-400">
                    {adminEmail}
                  </p>
                  <div className="mt-2 flex items-center gap-1.5 rounded-lg bg-indigo-50 px-2 py-1 text-[11px] font-semibold text-indigo-700">
                    <ShieldCheck size={14} />
                    <span>Verified Superadmin</span>
                  </div>
                </div>

                {/* Nav Links */}
                <div className="py-1">
                  <Link
                    href="/dashboard/profile"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100"
                  >
                    <User size={15} className="text-slate-400" />
                    Account Profile
                  </Link>
                  <Link
                    href="/dashboard/settings"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100"
                  >
                    <Settings size={15} className="text-slate-400" />
                    School Settings
                  </Link>
                  <Link
                    href="/dashboard/updates"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100"
                  >
                    <Sparkles size={15} className="text-indigo-500" />
                    What's New
                  </Link>
                </div>

                {/* Logout Action */}
                <div className="border-t border-slate-100 pt-1">
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-50"
                  >
                    <LogOut size={15} />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar