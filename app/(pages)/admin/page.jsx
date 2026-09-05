"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminDashboard() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSubmissions() {
      try {
        const res = await fetch("/api/apply");
        const data = await res.json();
        if (data.success) {
          setSubmissions(data.data);
        }
      } catch (err) {
        console.error("Failed to load submissions", err);
      } finally {
        setLoading(false);
      }
    }
    fetchSubmissions();
  }, []);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 p-6 md:p-12 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex justify-between items-center border-b border-neutral-800 pb-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-blue-400 font-semibold">
              Admin Portal
            </span>
            <h1 className="text-2xl font-bold text-white mt-1">
              Received Applications ({submissions.length})
            </h1>
          </div>
          <Link
            href="/"
            className="text-xs bg-neutral-800 hover:bg-neutral-700 text-white px-3 py-2 rounded-md transition"
          >
            &larr; Home
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12 text-neutral-500 text-sm">
            Loading applications...
          </div>
        ) : submissions.length === 0 ? (
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 text-center text-neutral-500 text-sm">
            No applications submitted yet.
          </div>
        ) : (
          <div className="space-y-4">
            {submissions.map((item) => (
              <div
                key={item.id}
                className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-3"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {item.fullName}
                    </h3>
                    <span className="text-xs text-neutral-500">
                      Submitted on {new Date(item.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {item.departments.map((dept, i) => (
                      <span
                        key={i}
                        className="bg-blue-950/60 text-blue-400 border border-blue-800/40 text-[10px] px-2.5 py-1 rounded-full font-mono capitalize"
                      >
                        {dept.replace(/-/g, " ")}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-neutral-300 bg-neutral-950 p-4 rounded-xl border border-neutral-800/60 leading-relaxed">
                  "{item.reason}"
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}