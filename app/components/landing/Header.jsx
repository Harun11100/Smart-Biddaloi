'use client';

import React, { useState } from "react";
import { Menu, X, Phone, Mail, Sparkles, Globe, ChevronRight } from "lucide-react";
import { NAV_LINKS } from "../../data/mockData";
import Image from "next/image";

export default function Header({ scrolled, activeSection }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lang, setLang] = useState("BN");

  return (
    <header className="fixed top-0 inset-x-0 z-50 transition-all duration-300">
      {/* Top Banner - Quick Contact & Language Toggle */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 text-slate-100 text-xs sm:text-sm py-1.5 px-4 shadow-inner border-b border-emerald-800/40">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Quick Contact Info */}
          <div className="flex items-center gap-4 text-xs text-slate-300">
            <a href="tel:+8801700000000" className="flex items-center gap-1.5 hover:text-amber-400 transition font-medium">
              <Phone size={13} className="text-emerald-400" /> +8801940549637
            </a>
            <a href="mailto:info@barenda.edu.bd" className="hidden sm:flex items-center gap-1.5 hover:text-amber-400 transition font-medium">
              <Mail size={13} className="text-emerald-400" /> info@barenda.edu.bd
            </a>
          </div>

          {/* Right Action / Language Selector */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setLang(lang === "BN" ? "EN" : "BN")}
              className="flex items-center gap-1 px-2.5 py-0.5 rounded-md border border-slate-700 bg-slate-800/80 hover:bg-slate-700 transition text-[11px] text-amber-300 font-semibold"
            >
              <Globe size={11} /> {lang === "BN" ? "English" : "বাংলা"}
            </button>
          </div>

        </div>
      </div>

      {/* Main Navbar */}
      <div className="px-3 sm:px-6 pt-2">
        <nav
          className={`max-w-7xl mx-auto rounded-2xl transition-all duration-500 border ${
            scrolled
              ? "bg-white/90 backdrop-blur-xl border-emerald-100 shadow-xl shadow-emerald-950/10 py-2.5"
              : "bg-white/75 backdrop-blur-md border-white/60 shadow-lg shadow-slate-900/5 py-3.5"
          }`}
        >
          <div className="flex items-center justify-between px-3 sm:px-6">
            
            {/* Brand Logo & Name */}
            <a href="#home" className="flex items-center gap-3 group min-w-0">
              <div className="relative shrink-0">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 via-emerald-700 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-700/30 ring-2 ring-emerald-500/20 group-hover:scale-105 transition duration-300">
               
                  <Image
                    src="/icon.png"
                    alt="School Logo"
                    width={48}
                    height={48}
                  />
                </div>
                <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-amber-400 border-2 border-white flex items-center justify-center text-[8px] font-bold text-slate-900">
                  ★
                </span>
              </div>

              <div className="flex flex-col min-w-0">
                <span className="text-base sm:text-lg lg:text-xl font-extrabold bg-gradient-to-r from-emerald-950 via-emerald-800 to-blue-900 bg-clip-text text-transparent truncate tracking-tight leading-tight">
                  বারেন্ডা সবুজ কানন
                </span>
                <span className="text-[11px] sm:text-xs font-semibold text-emerald-700/90 tracking-wide flex items-center gap-1.5 truncate">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block"></span>
                  স্কুল এন্ড কলেজ • স্থাপিত ২০০০
                </span>
              </div>
            </a>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-1 xl:gap-2 bg-slate-100/70 p-1.5 rounded-full border border-slate-200/80">
              {NAV_LINKS.map((link) => {
                const isActive = activeSection === link.href.substring(1);
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    className={`relative px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ${
                      isActive
                        ? "bg-emerald-800 text-white shadow-sm shadow-emerald-900/30"
                        : "text-slate-700 hover:text-emerald-800 hover:bg-white/80"
                    }`}
                  >
                    {link.name}
                    {isActive && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-amber-400 rounded-full"></span>
                    )}
                  </a>
                );
              })}
            </div>

            {/* Action CTA & Mobile Toggle */}
            <div className="flex items-center gap-2 sm:gap-3">
              <a
                href="#meritorious"
                className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 hover:from-amber-600 hover:to-amber-700 text-slate-950 text-xs font-bold shadow-md shadow-amber-500/20 hover:shadow-lg transition duration-300 ring-2 ring-amber-400/30 transform hover:-translate-y-0.5"
              >
                <Sparkles size={14} className="animate-spin" style={{ animationDuration: "4s" }} />
                <span>কৃতি শিক্ষার্থী</span>
              </a>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2.5 rounded-xl bg-emerald-50 text-emerald-900 hover:bg-emerald-100 transition border border-emerald-200"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile Drawer Navigation */}
          {mobileMenuOpen && (
            <div className="lg:hidden border-t border-emerald-100 mt-3 pt-3 px-4 pb-4 bg-white/95 backdrop-blur-2xl rounded-b-2xl animate-in slide-in-from-top-2 duration-300">
              <div className="flex flex-col space-y-1">
                {NAV_LINKS.map((link) => {
                  const isActive = activeSection === link.href.substring(1);
                  return (
                    <a
                      key={link.name}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
                        isActive
                          ? "bg-emerald-800 text-white font-bold"
                          : "text-slate-700 hover:bg-emerald-50 hover:text-emerald-800"
                      }`}
                    >
                      <span>{link.name}</span>
                      <ChevronRight size={16} className={isActive ? "text-amber-400" : "text-slate-400"} />
                    </a>
                  );
                })}

                <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
                  <a
                    href="#meritorious"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-center font-bold text-sm shadow-md flex items-center justify-center gap-2"
                  >
                    <Sparkles size={16} />
                    কৃতি শিক্ষার্থী তালিকা
                  </a>
                </div>
              </div>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}