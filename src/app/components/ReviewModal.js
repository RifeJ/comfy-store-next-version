"use client";

import React, { useState } from "react";

export default function ReviewModal({
  isOpen,
  onClose,
  onSubmit,
  productName,
}) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert("Please select a rating!");
      return;
    }

    setIsSubmitting(true);

    await onSubmit({ rating, comment });

    setIsSubmitting(false);
    setRating(0);
    setComment("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-99 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-primary-content rounded-2xl max-w-md w-full shadow-2xl border border-primary/20 overflow-hidden transform transition-all animate-fade-in">
        <div className="px-6 py-4 border-b border-primary/20 flex justify-between items-center bg-primary-content">
          <div>
            <h3 className="text-lg font-bold text-primary">Write a Review</h3>
            <p className="text-xs text-gray-500 truncate max-w-70">
              For: {productName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition p-1 rounded-lg hover:bg-gray-100">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="text-center">
            <label className="block text-sm font-semibold text-primary/90 mb-2">
              How would you rate this item?
            </label>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 transition-transform active:scale-95 focus:outline-none">
                  <svg
                    className={`w-10 h-10 transition-colors duration-150 ${
                      star <= (hoverRating || rating)
                        ? "text-amber-400 fill-amber-400"
                        : "text-gray-300 fill-transparent hover:text-amber-300"
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.5">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11.48 3.499c.197-.39.73-.39.927 0l2.184 4.327 4.8 1.102c.44.101.618.624.318.94l-3.43 3.608.686 4.681c.063.43-.4.736-.815.53l-4.338-2.182-4.338 2.182c-.415.207-.878-.1-.815-.53l.686-4.681-3.43-3.608c-.3-.316-.122-.839.318-.94l4.8-1.101 2.184-4.327z"
                    />
                  </svg>
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-sm font-medium text-amber-600 mt-2">
                {rating === 5
                  ? "Excellent! 😍"
                  : rating === 4
                    ? "Very Good! 🙂"
                    : rating === 3
                      ? "Good 😐"
                      : rating === 2
                        ? "Bad 🙁"
                        : "Terrible 😡"}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="comment"
              className="block text-sm font-semibold text-primary/90 mb-2">
              Share your thoughts
            </label>
            <textarea
              id="comment"
              rows="4"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What did you like or dislike about this product? How was the quality?"
              className="w-full px-4 py-3 border border-primary/20 rounded-xl shadow-sm placeholder-primary/50 focus:ring-2  transition duration-150 text-sm"
              required></textarea>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2.5 border border-primary/20 text-primary hover:text-primary-content rounded-xl text-sm font-semibold hover:bg-primary transition active:scale-[0.98] disabled:opacity-50">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || rating === 0}
              className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition active:scale-[0.98] shadow-md shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Sending...
                </>
              ) : (
                "Submit Review"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
