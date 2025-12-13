// app/components/FeaturesSection.jsx
import { BookOpen, Users, Award } from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      icon: <BookOpen className="text-blue-600 w-8 h-8" />,
      title: "স্মার্ট লার্নিং",
      desc: "ডিজিটাল ক্লাসরুম ও ইন্টারেকটিভ কনটেন্টের মাধ্যমে আরও ভালোভাবে শেখার সুযোগ।",
    },
    {
      icon: <Users className="text-blue-600 w-8 h-8" />,
      title: "অভিজ্ঞ শিক্ষকবৃন্দ",
      desc: "উচ্চ যোগ্যতাসম্পন্ন শিক্ষকরা শিক্ষার্থীদের সফলতার পথে দিকনির্দেশনা দেন।",
    },
    {
      icon: <Award className="text-blue-600 w-8 h-8" />,
      title: "অর্জনসমূহ",
      desc: "আমাদের শিক্ষার্থীরা পরীক্ষায় ও বিভিন্ন প্রতিযোগিতায় নিয়মিতভাবে উৎকৃষ্ট ফলাফল করে।",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-12">কেন আমাদের বেছে নেবেন?</h2>
        <div className="grid md:grid-cols-3 gap-10">
          {features.map((f, i) => (
            <div
              key={i}
              className="p-6 border rounded-xl shadow-sm hover:shadow-lg transition"
            >
              <div className="flex justify-center mb-4">{f.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
              <p className="text-gray-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
