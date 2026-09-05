"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function JoinPage({ params }) {
  const selectedDepts = params?.joinIds || [];

  const [fullName, setFullName] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const response = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          reason,
          departments: selectedDepts,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Submission failed");
      }

      setSubmitted(true);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center p-6 font-sans">
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 text-center space-y-4 max-w-lg w-full shadow-2xl">
          <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-xl">
            ✓
          </div>
          <h2 className="text-2xl font-bold">Application Submitted!</h2>
          <p className="text-sm text-neutral-400">
            Your application has been saved to the database. We will review it shortly.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Link
              href="/"
              className="bg-neutral-800 hover:bg-neutral-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition"
            >
              Return Home
            </Link>
            <Link
              href="/admin"
              className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition"
            >
              View Admin Panel
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 p-6 md:p-12 font-sans flex items-center justify-center">
      <div className="max-w-xl w-full bg-neutral-900 border border-neutral-800 rounded-2xl p-8 space-y-6 shadow-2xl">
        <div>
          <span className="text-xs uppercase tracking-widest text-blue-400 font-semibold">
            Step 02 · Application
          </span>
          <h1 className="text-3xl font-bold text-white mt-1">Complete your application</h1>
          <p className="text-sm text-neutral-400 mt-1">
            Applying for <strong className="text-white">{selectedDepts.length} department(s)</strong>.
          </p>
        </div>

        {/* Department Badges */}
        <div className="flex flex-wrap gap-2">
          {selectedDepts.map((id, idx) => (
            <span
              key={idx}
              className="bg-blue-950/60 text-blue-400 text-xs px-3 py-1 rounded-full font-medium border border-blue-800/50 capitalize"
            >
              {id.replace(/-/g, " ")}
            </span>
          ))}
        </div>

        {errorMsg && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-xs">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="John Doe"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">
              Why do you want to join?
            </label>
            <textarea
              required
              rows={4}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Share your experience and motivation..."
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-lg text-sm transition shadow-lg shadow-blue-600/20 ${
              loading ? "opacity-50 cursor-wait" : "cursor-pointer"
            }`}
          >
            {loading ? "Submitting..." : "Submit Application"}
          </button>
        </form>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  return [
    { joinIds: ["design"] },
    { joinIds: ["web-development"] },
    { joinIds: ["design", "app-development"] },
  ];
}
