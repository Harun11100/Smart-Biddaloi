import React from "react";
import { ShieldCheck, Compass, Users, Trophy } from "lucide-react";

const FACILITIES = [
  { icon: ShieldCheck, title: "সিসিটিভি নিরাপত্তা", desc: "সমগ্র ক্যাম্পাস ২৪/৭ সিসিটিভি ক্যামেরা দ্বারা নিয়ন্ত্রিত।" },
  { icon: Compass, title: "ডিজিটাল ল্যাব", desc: "হাই-স্পিড ইন্টারনেটসহ অত্যাধুনিক কম্পিউটার ল্যাব।" },
  { icon: Users, title: "দক্ষ শিক্ষকবৃন্দ", desc: "অভিজ্ঞ ও নিবেদিতপ্রাণ শিক্ষক-শিক্ষিকাদের সার্বিক তত্ত্বাবধান।" },
  { icon: Trophy, title: "সহ-শিক্ষা কার্যক্রম", desc: "খেলাধুলা, বিতর্ক, স্কাউটিং ও সাংস্কৃতিক প্রতিযোগিতা।" },
];

export default function FacilitiesSection() {
  return (
    <section id="facilities" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
            আধুনিক সুবিধা
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 mt-3">
            কেন আমাদের বেছে নেবেন?
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FACILITIES.map((fac, idx) => {
            const Icon = fac.icon;
            return (
              <div key={idx} className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-emerald-200 transition text-center hover:bg-emerald-50/30">
                <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mb-4">
                  <Icon size={22} />
                </div>
                <h4 className="font-bold text-slate-900 text-base">{fac.title}</h4>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{fac.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}