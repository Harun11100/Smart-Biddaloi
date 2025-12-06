"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Formik, Form, Field } from "formik";
import ProductCard from "@/app/components/productCard";
import { useParams } from "next/navigation";

export default function ProductsPage() {

  const params = useParams();
  const adminId = params.adminId;

  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch Products on Mount
useEffect(() => {
  if (!adminId) return; // wait for params
  fetchProducts();
}, [adminId]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("/api/products/getAllproducts", { params: {
            adminId, 
          }})
        ;
      setProducts(res.data.products || []);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteHandle = async (id) => {
    if (!confirm("Are you sure?")) return;
    try {
      await axios.delete(`/api/products/delete/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
      alert("Product deleted");
    } catch (err) {
      console.error(err);
      alert("Failed to delete");
    }
  };

  const editHandle = (product) => setEditingProduct(product);
  const closeModal = () => setEditingProduct(null);

  const submitEdit = async (values) => {
    try {
      const res = await axios.put(`/api/products/edit/${values._id}`, values);
      setProducts((prev) =>
        prev.map((p) => (p._id === values._id ? res.data.product : p))
      );
      alert("Product updated");
      closeModal();
    } catch (err) {
      console.error(err);
      alert("Failed to update");
    }
  };

  // UI
  return (
    <div className="max-w-6x  mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">All Products</h1>

      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : products.length === 0 ? (
        <p className="text-gray-500">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onEdit={editHandle}
              onDelete={deleteHandle}
            />
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Product</h2>

            <Formik initialValues={editingProduct} onSubmit={submitEdit}>
              {() => (
                <Form className="flex flex-col gap-4">
                  <Field
                    name="name"
                    placeholder="Product Name"
                    className="border p-2 rounded"
                  />
                  <Field
                    name="price"
                    type="number"
                    placeholder="Price"
                    className="border p-2 rounded"
                  />
                  <Field
                    name="discount"
                    type="number"
                    placeholder="Discount"
                    className="border p-2 rounded"
                  />

                  <div className="flex justify-end gap-2 mt-4">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="bg-gray-400 text-white py-1 px-4 rounded hover:bg-gray-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-600 text-white py-1 px-4 rounded hover:bg-blue-700"
                    >
                      Save
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}
    </div>
  );
}
