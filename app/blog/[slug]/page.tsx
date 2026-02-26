import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AgeGate from "@/components/AgeGate";
import { posts, getPostBySlug, formatDate } from "@/lib/posts";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: `${post.title} — KraKrám`,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      locale: "cs_CZ",
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const otherPosts = posts.filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <>
      <AgeGate />
      <Navbar />
      <main className="min-h-screen bg-green-bg">
        {/* Hero */}
        <section className="bg-green-bg-dark pt-40 pb-16 px-6 md:px-12">
          <div className="max-w-3xl mx-auto">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm text-ink-muted hover:text-forest transition-colors mb-10"
            >
              ← Zpět na blog
            </Link>
            <span className="text-xs font-semibold text-forest uppercase tracking-widest block mb-4">
              {post.category}
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-ink leading-tight mb-6">
              {post.title}
            </h1>
            <p className="text-ink-soft text-lg leading-relaxed mb-8">{post.description}</p>
            <div className="flex items-center gap-4 text-sm text-ink-muted">
              <span>{formatDate(post.date)}</span>
              <span className="w-1 h-1 rounded-full bg-ink-muted" />
              <span>{post.readTime} min čtení</span>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="px-6 md:px-12 py-16">
          <div
            className="max-w-3xl mx-auto prose-kratom"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </section>

        {/* CTA */}
        <section className="px-6 md:px-12 pb-16">
          <div className="max-w-3xl mx-auto bg-forest rounded-2xl p-10 text-cream flex flex-col md:flex-row md:items-center gap-6 justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">Máte otázky?</h3>
              <p className="text-cream/75 text-sm">Rádi vám poradíme — napište nebo zavolejte.</p>
            </div>
            <Link
              href="/#kontakt"
              className="shrink-0 bg-cream text-forest font-semibold px-7 py-3 rounded-full hover:bg-green-bg transition-colors text-sm"
            >
              Kontaktujte nás
            </Link>
          </div>
        </section>

        {/* Related posts */}
        {otherPosts.length > 0 && (
          <section className="px-6 md:px-12 pb-20">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-xl font-bold text-ink mb-8">Další články</h2>
              <div className="flex flex-col gap-4">
                {otherPosts.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/blog/${p.slug}`}
                    className="group flex items-start gap-5 bg-green-bg border border-border-green rounded-xl p-5 hover:border-forest/30 hover:shadow-md transition-all"
                  >
                    <div className="flex-1">
                      <span className="text-xs font-semibold text-forest uppercase tracking-widest">
                        {p.category}
                      </span>
                      <h3 className="font-semibold text-ink mt-1 group-hover:text-forest transition-colors">
                        {p.title}
                      </h3>
                    </div>
                    <span className="text-ink-muted text-sm shrink-0 mt-1">{p.readTime} min</span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
