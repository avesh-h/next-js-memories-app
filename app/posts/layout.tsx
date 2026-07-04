import { Navbar } from "@/components/layout/Navbar";

/** Shell for all /posts routes — the Navbar plus a centered content column. */
export default function PostsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
