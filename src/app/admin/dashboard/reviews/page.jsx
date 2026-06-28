"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all reviews
  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/reviews");
      const data = await res.json();
      setReviews(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Reviews fetch error:", err);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // Approve a review
  const approveReview = async (id) => {
    try {
      const res = await fetch(`/api/admin/reviews?id=${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Approved" }),
      });
      const data = await res.json();
      setReviews((prev) =>
        prev.map((r) => (r._id === id ? { ...r, status: data.status } : r)),
      );
    } catch (err) {
      console.error("Approve review error:", err);
    }
  };

  // Reject a review
  const rejectReview = async (id) => {
    try {
      const res = await fetch(`/api/admin/reviews?id=${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Rejected" }),
      });
      const data = await res.json();
      setReviews((prev) =>
        prev.map((r) => (r._id === id ? { ...r, status: data.status } : r)),
      );
    } catch (err) {
      console.error("Reject review error:", err);
    }
  };

  const renderReviewsTable = () => {
    if (!reviews.length)
      return (
        <p className="py-6 text-center text-neutral-500">No reviews found.</p>
      );

    return (
      <div className="border border-neutral-200/60 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-neutral-50/70">
            <tr>
              <th className="py-5 px-6 text-left text-sm font-medium text-neutral-600">
                Product
              </th>
              <th className="py-5 px-6 text-left text-sm font-medium text-neutral-600">
                Customer
              </th>
              <th className="py-5 px-6 text-left text-sm font-medium text-neutral-600">
                Rating
              </th>
              <th className="py-5 px-6 text-left text-sm font-medium text-neutral-600">
                Comment
              </th>
              <th className="py-5 px-6 text-left text-sm font-medium text-neutral-600">
                Date
              </th>
              <th className="py-5 px-6 text-left text-sm font-medium text-neutral-600">
                Status
              </th>
              <th className="py-5 px-6 w-32">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200/60">
            {reviews.map((review) => (
              <tr
                key={review._id}
                className="hover:bg-neutral-50/50 transition-colors"
              >
                <td className="py-6 px-6 font-medium">
                  {review.product?.title || "—"}
                </td>
                <td className="py-6 px-6">
                  {review.user?.name || review.user?.email}
                </td>
                <td className="py-6 px-6 text-amber-700 font-medium">
                  {"★".repeat(review.rating)}
                </td>
                <td className="py-6 px-6 text-neutral-600 max-w-md line-clamp-2">
                  {review.comment}
                </td>
                <td className="py-6 px-6 text-neutral-600">
                  {new Date(review.createdAt).toLocaleDateString()}
                </td>
                <td className="py-6 px-6">
                  <span
                    className={`px-4 py-1 text-xs font-medium rounded-full ${
                      review.status?.toLowerCase() === "approved"
                        ? "bg-emerald-50 text-emerald-800"
                        : review.status?.toLowerCase() === "rejected"
                          ? "bg-red-50 text-red-700"
                          : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {review.status?.toUpperCase()}
                  </span>
                </td>
                <td className="py-6 px-8 flex gap-3">
                  {review.status?.toLowerCase() === "pending" && (
                    <>
                      <button
                        onClick={() => approveReview(review._id)}
                        className="px-4 py-1.5 bg-emerald-600 text-white text-xs rounded-lg hover:bg-emerald-700 transition-colors"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => rejectReview(review._id)}
                        className="px-4 py-1.5 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <motion.div initial="hidden" animate="visible">
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-4xl md:text-5xl font-['Playfair_Display'] font-medium">
          Reviews
        </h1>
        <div className="text-neutral-600 font-light">
          Showing {reviews?.length || 0} reviews
        </div>
      </div>
      {loading ? <p>Loading...</p> : renderReviewsTable()}
    </motion.div>
  );
}
