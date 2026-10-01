'use client';
import React, { useState, useEffect } from "react";
import Header from "./components/landing/Header";
import HeroSection from "./components/landing/HeroSection";
import AcademicsSection from "./components/landing/AcademicsSection";
import FacilitiesSection from "./components/landing/FacilitiesSection";
import MeritoriousSection from "./components/landing/MeritoriousSection";
import TeachersSection from "./components/landing/TeachersSection";
import Footer from "./components/landing/Footer";

export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  // Dynamic Scroll Listener
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ScrollSpy logic for navigation highlighting
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
      { threshold: 0.3 }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased selection:bg-emerald-500 selection:text-white">
      <Header scrolled={scrolled} activeSection={activeSection} />
      <main>
        <HeroSection />
        <AcademicsSection />
        <FacilitiesSection />
        <MeritoriousSection />
        <TeachersSection />
      </main>
      <Footer />
    </div>
  );
}