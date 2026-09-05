import { Suspense } from "react";
import JoinFormContent from "./JoinFormContent";

// 1. Server Component exports generateStaticParams (NO "use client" at top of file)
export async function generateStaticParams() {
  return [
    { joinIds: ["design"] },
    { joinIds: ["web-development"] },
    { joinIds: ["design", "app-development"] },
  ];
}

export default function JoinPage({ params }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">Loading...</div>}>
      <JoinFormContent params={params} />
    </Suspense>
  );
}
