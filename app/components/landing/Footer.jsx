import React from "react";
import { Phone, Mail, MapPin,ShieldCheck } from "lucide-react";
import { NAV_LINKS } from "../../data/mockData";

export default function Footer() {
  return (
    <footer id="contact" className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          
          {/* School Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-amber-300 font-bold">
                B
              </div>
              <span className="font-extrabold text-white text-lg">বারেন্ডা সবুজ কানন</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              বারেন্ডা সবুজ কানন স্কুল এন্ড কলেজ মানসম্মত শিক্ষা নিশ্চিতে প্রতিশ্রুতিবদ্ধ একটি অগ্রগামী শিক্ষা প্রতিষ্ঠান।
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="text-sm font-bold text-white mb-4">দ্রুত লিংক</h5>
            <ul className="space-y-2 text-xs">
              {NAV_LINKS.map((l, i) => (
                <li key={i}>
                  <a href={l.href} className="hover:text-amber-400 transition">{l.name}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h5 className="text-sm font-bold text-white mb-4">যোগাযোগ</h5>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <MapPin size={14} className="text-emerald-400" /> বারেন্ডা, ক্যাম্পাস রোড
              </li>
              <li className="flex items-center gap-2">
                <Phone size={14} className="text-emerald-400" /> +8801940549637
              </li>
              <li className="flex items-center gap-2">
                <Mail size={14} className="text-emerald-400" /> info@barenda.edu.bd
              </li>
            </ul>
          </div>

          {/* Admission Open Box */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950 to-slate-900 border border-emerald-800/50">
            <span className="text-xs font-bold text-amber-400 block mb-1">ভর্তি সহায়তায়</span>
            <p className="text-xs text-slate-300 mb-3">যে কোনো তথ্যের জন্য আমাদের হেল্পলাইনে কল করুন</p>
            <a
              href="tel:+8801700000000"
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs text-center block transition"
            >
              কল করুন
            </a>
          </div>

        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© ২০২৬ বারেন্ডা সবুজ কানন স্কুল এন্ড কলেজ। সর্বস্বত্ব সংরক্ষিত।</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-slate-300">গোপনীয়তা নীতি</a>
            <a href="#" className="hover:text-slate-300">ব্যবহারের শর্তাবলী</a>
          </div>
        </div>
      </div>
      <a
  href="/management"
  target="_blank"
  rel="noopener noreferrer"
  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white hover:text-amber-300 text-xs font-bold backdrop-blur-md shadow-sm transition-all duration-300 hover:scale-105 group"
>
  <ShieldCheck size={14} className="text-amber-400 group-hover:rotate-12 transition-transform duration-300" />
  <span className="tracking-wide">Admin Login</span>
</a>
    </footer>
  );
}