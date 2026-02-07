"use client";

import Image from "next/image";
import {
  FaFacebookF,
  FaYoutube,
  FaInstagram,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaUserShield,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-tr from-blue-700  to-blue-900 text-gray-200">
      {/* Top Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* School Info */}
        <div>
         <div className=" justify-center flex mb-4">
                <Image
                  src="/logo.png"
                  alt="Logo"
                  width={80}
                  height={80}
                  className=" object-contain"
                />
              </div>
          <h2 className="text-xl sm:text-2xl md:text-2xl lg:text-3xl font-bold text-white mb-4 leading-snug">
            বারেন্ডা এফ. চান একাডেমী
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-gray-300 leading-relaxed">
            মানসম্মত শিক্ষা, দৃঢ় মূল্যবোধ এবং বাস্তব দক্ষতার মাধ্যমে শিশুদের উজ্জ্বল ভবিষ্যতের জন্য প্রস্তুত করা।
          </p>

          {/* Social Icons */}
          <div className="flex space-x-4 mt-6">
            <SocialIcon icon={<FaFacebookF />} />
            <SocialIcon icon={<FaYoutube />} />
            <SocialIcon icon={<FaInstagram />} />
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg sm:text-xl font-semibold text-white mb-4">দ্রুত লিঙ্ক</h3>
          <ul className="space-y-2 text-xs sm:text-sm md:text-base">
            <FooterLink href="#home" label="হোম" />
            <FooterLink href="#academics" label="একাডেমিক" />
            <FooterLink href="#facilities" label="সুবিধাসমূহ" />
            <FooterLink href="#teachers" label="শিক্ষকবৃন্দ" />
            <FooterLink href="#contact" label="যোগাযোগ" />
          </ul>
        </div>

        {/* Academics */}
        <div>
          <h3 className="text-lg sm:text-xl font-semibold text-white mb-4">একাডেমিক</h3>
          <ul className="space-y-2 text-xs sm:text-sm md:text-base text-gray-300">
            <li>প্রাথমিক শিক্ষা</li>
            <li>মাধ্যমিক শিক্ষা</li>
            <li>বিজ্ঞান ও প্রযুক্তি</li>
            <li>শিল্প ও খেলাধুলা</li>
            <li>সহ-শিক্ষামূলক কার্যক্রম</li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg sm:text-xl font-semibold text-white mb-4">যোগাযোগ করুন</h3>
          <ul className="space-y-3 text-xs sm:text-sm md:text-base text-gray-300">
            <li className="flex items-start gap-3">
              <FaMapMarkerAlt className="mt-1 text-blue-400" />
              <span>বারেন্ডা, মোল্লা মার্কেট, ৩নং ওয়ার্ড, কাশিমপুর, গাজীপুর</span>
            </li>
            <li className="flex items-center gap-3">
              <FaPhoneAlt className="text-blue-400" />
              <span>+880 1234 567890</span>
            </li>
            <li className="flex items-center gap-3">
              <FaEnvelope className="text-blue-400" />
              <span>barendaf.chanacademy@gmail.com</span>
            </li>
          </ul>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-4 text-xs sm:text-sm md:text-base text-gray-200">
          <p>
            © {new Date().getFullYear()} বারেন্ডা এফ. চান একাডেমী। সর্বস্বত্ব সংরক্ষিত।
          </p>

          {/* Management Link */}
          <a
            href="/management"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-white hover:text-blue-200 transition-all duration-300 group"
          >
            <FaUserShield className="text-blue-400 group-hover:scale-110 transition-transform duration-300" />
            <span className="tracking-wide">Management Login</span>
          </a>
        </div>
      </div>
    </footer>
  );
}

/* ---------------- Sub Components ---------------- */

function FooterLink({ href, label }) {
  return (
    <li>
      <a
        href={href}
        className="hover:text-white transition-colors duration-200"
      >
        {label}
      </a>
    </li>
  );
}

function SocialIcon({ icon }) {
  return (
    <a
      href="#"
      className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-blue-500 hover:text-white transition-all duration-300 shadow-sm hover:shadow-md"
    >
      {icon}
    </a>
  );
}
