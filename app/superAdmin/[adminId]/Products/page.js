"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

export default function ProductsHome() {

    const params = useParams();
    const adminId = params.adminId;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-10 rounded-xl shadow-lg text-center space-y-6 w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-800">Product Dashboard</h1>
        <p className="text-gray-500">Manage and explore all your products</p>

        <div className="space-y-4">
          <Link
            href={`/admin/${adminId}/Products/allProducts`}
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
          >
            View All Products
          </Link>

          <Link
            href={`/admin/${adminId}/Products/createProduct`}
            className="block w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition"
          >
            Upload Product
          </Link>
        </div>
      </div>
    </div>
  );
}
