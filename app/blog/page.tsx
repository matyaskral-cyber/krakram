import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AgeGate from "@/components/AgeGate";
import { posts, formatDate } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Blog — KraKrám | Kratom průvodce a informace",
  description:
    "Čtěte o kratom u vše podstatné. Průvodce dávkováním, druhy odrůd, právní status v ČR a další odborné články.",
  alternates: {
    canonical: "/blog",
  },
};

export default function BlogPage() {
  const sorted = [...posts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <>
      <AgeGate />
      <Navbar />
      <main className="min-h-screen bg-green-bg">
        {/* Header */}
        <section className="bg-green-bg-dark pt-40 pb-20 px-6 md:px-12">
          <div className="max-w-6xl mx-auto">
            <p className="text-sm uppercase tracking-widest font-medium text-forest-muted mb-4">
              Blog
            </p>
            <div className="w-12 h-px bg-forest mb-8" />
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-ink mb-4">
              Průvodce světem kratom u
            </h1>
            <p className="text-ink-soft text-lg max-w-xl leading-relaxed">
              Informace, návody a zajímavosti pro každého, kdo chce o kratom u vědět víc.
            </p>
          </div>
        </section>

        {/* Posts grid */}
        <section className="px-6 md:px-12 py-20">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sorted.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group bg-green-bg border border-border-green rounded-2xl p-7 flex flex-col hover:shadow-lg hover:border-forest/30 transition-all duration-200"
              >
                <span className="text-xs font-semibold text-forest uppercase tracking-widest mb-4">
                  {post.category}
                </span>
                <h2 className="text-lg font-bold text-ink mb-3 leading-snug group-hover:text-forest transition-colors">
                  {post.title}
                </h2>
                <p className="text-ink-muted text-sm leading-relaxed flex-1 mb-6">
                  {post.description}
                </p>
                <div className="flex items-center justify-between text-xs text-ink-muted pt-4 border-t border-border-green">
                  <span>{formatDate(post.date)}</span>
                  <span>{post.readTime} min čtení</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
