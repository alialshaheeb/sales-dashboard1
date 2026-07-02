import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 px-6 text-center">
      <h1 className="text-3xl font-semibold text-slate-800">Sales Dashboard</h1>
      <p className="max-w-md text-sm text-slate-500">
        A Next.js 15 + TypeScript + Tailwind dashboard built with atomic
        design principles, analyzing the real Superstore Sales dataset
        (9,994 real orders, 2014&ndash;2017), with a year selector and
        switchable bar / line / pie charts.
      </p>
      <Link
        href="/dashboard"
        className="mt-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
      >
        Go to Dashboard
      </Link>
    </div>
  );
}
