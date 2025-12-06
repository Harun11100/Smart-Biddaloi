// app/schools/SchoolCard.jsx

import Image from "next/image";
import Link from "next/link";


export default function SchoolCard({ school,adminId}) {
  
  const slug = school.schoolName.replace(/\s+/g, '-').toLowerCase();
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition overflow-hidden">
      <Image
        src={school.cover.url}
        alt={school.schoolName}
        width={400}
        height={250}
        className="w-full h-48 object-cover"
      />
      <div className="p-5">
        <h3 className="text-xl font-semibold text-blue-900 mb-2">
          {school.name}
        </h3>
        <p className="text-gray-600 text-sm mb-4">{school.address}</p>
        <Link
          href={`/admin/${adminId}/school/${school._id}/smart-biddaloi/${slug}`}
          className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-500 transition"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
