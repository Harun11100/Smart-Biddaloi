"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import Image from "next/image";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [open, setOpen] = useState(false);

  // Shadow + blur on scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll spy
  useEffect(() => {
    const sections = document.querySelectorAll("section[id]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.6 }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const navLinks = [
    { name: "হোম", href: "#home" },
    { name: "একাডেমিক", href: "#academics" },
    { name: "সুবিধাসমূহ", href: "#facilities" },
    { name: "ছাত্রছাত্রীরা", href: "#meritorious" },
    { name: "শিক্ষকবৃন্দ", href: "#teachers" },
    { name: "আমাদের সম্পর্কে", href: "#about" },
   
  ];

  return (
    <>
      <nav
        className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl rounded-2xl transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-xl shadow-lg"
            : "bg-white/80 backdrop-blur-md"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-3 md:py-4">
          {/* Logo */}
         <div className="flex items-center space-x-3 md:space-x-4 p-2 md:p-0">
      {/* Logo */}
      <div className="flex-shrink-0">
        <Image
          src="/logo.png"
          alt="Logo"
          width={40}
          height={40}
          className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
        />
      </div>

      {/* School Name */}
      <Link
        href="#home"
        className="text-lg sm:text-sm md:text-2xl font-extrabold text-blue-800 hover:text-blue-600 transition-colors duration-300"
      >
        বারেন্ডা এফ. চান একাডেমী
      </Link>
    </div>
          

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.substring(1);
              return (
                <a
                  key={link.name}
                  href={link.href}
                  className={`relative text-sm font-medium transition-colors ${
                    isActive
                      ? "text-blue-800"
                      : "text-gray-700 hover:text-blue-700"
                  }`}
                >
                  {link.name}
                  <span
                    className={`absolute -bottom-1 left-1/2 h-[2px] w-6 -translate-x-1/2 rounded-full bg-emerald-500 transition-all ${
                      isActive
                        ? "opacity-100 scale-x-100"
                        : "opacity-0 scale-x-0"
                    }`}
                  />
                </a>
              );
            })}

            {/* Admission CTA */}
            <Link
              href="#contact"
              className="ml-2 rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-700 transition"
            >
              ভর্তি চলছে
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
            aria-label="Toggle menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="md:hidden border-t border-gray-200/60">
            <div className="flex flex-col px-5 py-4 space-y-2">
              {navLinks.map((link) => {
                const isActive = activeSection === link.href.substring(1);
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`px-4 py-3 rounded-xl text-sm font-medium transition ${
                      isActive
                        ? "bg-blue-50 text-blue-800"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {link.name}
                  </a>
                );
              })}

              <Link
                href="#contact"
                onClick={() => setOpen(false)}
                className="mt-3 text-center rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700 transition"
              >
                ভর্তি চলছে
              </Link>
            </div>
          </div>
        )}

        {/* Soft Academic Glow */}
        <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-r from-blue-200/40 via-emerald-200/40 to-blue-200/40 blur-lg" />
      </nav>

      {/* Spacer for fixed navbar */}
      <div className="h-24 md:h-28" />
    </>
  );
}
