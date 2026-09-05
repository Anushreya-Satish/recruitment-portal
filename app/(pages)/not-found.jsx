import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center p-6 text-center">
      <div className="space-y-4 max-w-md">
        <h1 className="text-6xl font-extrabold text-blue-500 font-mono">404</h1>
        <h2 className="text-xl font-bold">Page Not Found</h2>
        <p className="text-xs text-neutral-400">
          The requested page does not exist in the recruitment portal.
        </p>
        <div>
          <Link
            href="/"
            className="inline-block bg-neutral-800 hover:bg-neutral-700 text-white px-5 py-2.5 rounded-lg text-xs font-semibold transition"
          >
            Return to Safety &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}