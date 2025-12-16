// app/superAdmin-dashboard/components/Sidebar.js
"use client";

import React from "react";
import Link from "next/link";

const Sidebar = ({ adminId }) => {
  return (
    <div className="w-64 bg-indigo-700 min-h-screen text-white flex flex-col">
      <h1 className="text-2xl font-bold p-6 border-b border-indigo-600">
        Admin Panel
      </h1>
      <nav className="flex-1 mt-6">
        <ul>
          <li className="px-6 py-3 hover:bg-indigo-600">
            <Link href={`/superAdmin/${adminId}/dashboard`}>Home</Link>
          </li>
          <li className="px-6 py-3 hover:bg-indigo-600">
            <Link href={`/superAdmin/${adminId}/dashboard/schoolList`}>Schools</Link>
          </li>
           <li className="px-6 py-3 hover:bg-indigo-600">
            <Link href={`/superAdmin/${adminId}/register-school`}>School Register</Link>
          </li>
           <li className="px-6 py-3 hover:bg-indigo-600">
            <Link href={`/superAdmin/${adminId}/allProducts`}>All Products</Link>
          </li>
           <li className="px-6 py-3 hover:bg-indigo-600">
            <Link href={`/superAdmin/${adminId}/createProduct`}>Upload Products</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
