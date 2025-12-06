"use client";
import React from "react";

export default function ProductCard({ product, onEdit, onDelete }) {
  const { name, price, discount, image, title } = product;

  return (
    <div className="border rounded-lg shadow hover:shadow-lg transition p-4 flex flex-col">
      <img src={image} alt={name} className="w-full h-48 object-cover rounded mb-4" />

      {title && <p className="text-sm text-gray-500 mb-1">{title}</p>}

      <h2 className="text-lg font-semibold mb-2">{name}</h2>

      <p className="mt-1 font-bold">
        ${price}{" "}
        {discount > 0 && (
          <span className="line-through text-gray-400 ml-2">
            ${price + discount}
          </span>
        )}
      </p>

      <div className="mt-auto flex gap-2">
        <button
          onClick={() => onEdit(product)}
          className="flex-1 bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-600"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(product._id)}
          className="flex-1 bg-red-600 text-white py-1 px-3 rounded hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
