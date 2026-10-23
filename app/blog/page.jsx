import Link from 'next/link';
import Image from 'next/image';
import { Film, Calendar, Clock, ChevronRight, ArrowRight } from 'lucide-react';
import { SITE, POSTS } from '@/config/site';
import JsonLd from '@/components/JsonLd';

export const metadata = {
  title: 'Camera, Audio & Music Gear Guides',
  description:
    'Camera comparisons, audio workflows, lighting setups and buying guides to help Australian creators choose the right gear.',
  alternates: {
    canonical: `https://${SITE.domain}/blog/`,
  },
  other: {
    'og:updated_time': new Date().toISOString(),
  },
};

export default function BlogIndexPage() {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `https://${SITE.domain}/` },
      { '@type': 'ListItem', position: 2, name: 'Tech Guides & Blog', item: `https://${SITE.domain}/blog/` },
    ],
  };

  return (
    <>
      <JsonLd data={breadcrumbSchema} />

      <div className="bg-slate-950 min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10 text-white">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-400">
          <Link href="/" className="hover:text-amber-400 transition">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-white font-medium">Production Guides</span>
        </nav>

        <div className="pb-6 border-b border-slate-800 space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-amber-400">
            Field Notes & Technical Reviews
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
            Gear Guides & Workflows
          </h1>
          <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
            Camera comparisons, audio workflows, lighting setups and buying guides from the Theatricalz team in Melbourne.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {POSTS.map((post) => (
            <article
              key={post.slug}
              className="bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-3xl overflow-hidden shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="relative aspect-[16/9] w-full overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-slate-950/80 backdrop-blur-sm text-[11px] font-mono font-bold text-amber-400 uppercase border border-slate-800">
                  {post.category}
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mb-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{post.date}</span>
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{post.readTime}</span>
                    </span>
                  </div>

                  <h2 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors leading-snug">
                    <Link href={`/blog/${post.slug}/`}>
                      {post.title}
                    </Link>
                  </h2>

                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed mt-2">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800/80">
                  <Link
                    href={`/blog/${post.slug}/`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 group-hover:translate-x-1 transition-transform"
                  >
                    <span>Read Technical Review</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </>
  );
}
