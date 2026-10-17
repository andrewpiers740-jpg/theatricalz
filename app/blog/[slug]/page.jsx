import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Calendar, Clock, ChevronRight, ArrowRight, Share2, Film } from 'lucide-react';
import { SITE, POSTS } from '@/config/site';
import { PRODUCTS } from '@/config/products';
import JsonLd from '@/components/JsonLd';

export async function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = POSTS.find((p) => p.slug === slug);

  if (!post) {
    return { title: 'Article Not Found' };
  }

  return {
    title: `${post.title} — Theatricalz Australia`,
    description: post.excerpt,
    alternates: {
      canonical: `https://${SITE.domain}/blog/${post.slug}/`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [{ url: post.image }],
    },
    other: {
      'og:updated_time': new Date().toISOString(),
    },
  };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = POSTS.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  const postSchema = [
    {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.excerpt,
      image: [post.image],
      datePublished: post.date,
      dateModified: post.date,
      author: {
        '@type': 'Organization',
        name: `${SITE.name} Technical Camera Desk`,
        url: `https://${SITE.domain}/about/`,
      },
      publisher: {
        '@type': 'Organization',
        name: SITE.name,
        url: `https://${SITE.domain}/`,
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `https://${SITE.domain}/blog/${post.slug}/`,
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `https://${SITE.domain}/` },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: `https://${SITE.domain}/blog/` },
        { '@type': 'ListItem', position: 3, name: post.title, item: `https://${SITE.domain}/blog/${post.slug}/` },
      ],
    },
  ];

  return (
    <>
      <JsonLd data={postSchema} />

      <article className="bg-slate-950 min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-10 text-white">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-400">
          <Link href="/" className="hover:text-amber-400 transition">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <Link href="/blog/" className="hover:text-amber-400 transition">Blog</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-white font-medium truncate max-w-xs">{post.title}</span>
        </nav>

        {/* Article Header */}
        <div className="space-y-4 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-md bg-amber-500/10 text-amber-400 text-xs font-mono font-bold uppercase border border-amber-500/20">
              {post.category}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-slate-500" />
              <span>{post.date}</span>
            </span>
            <span>·</span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-slate-500" />
              <span>{post.readTime}</span>
            </span>
            <span>·</span>
            <span className="text-slate-300">By Theatricalz Technical Crew</span>
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
          <Image
            src={post.image}
            alt={post.title}
            fill
            priority
            className="object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Article Body Content */}
        <div className="prose prose-invert max-w-none text-slate-300 space-y-6 text-sm sm:text-base leading-relaxed">
          <p className="text-lg text-slate-200 font-medium leading-relaxed">
            {post.excerpt}
          </p>

          <h2 className="text-xl sm:text-2xl font-bold text-white uppercase tracking-tight pt-4">
            Acoustic Dynamics & Dynamic Range in Australian Field Conditions
          </h2>
          <p>
            When shooting in Australia—from the unforgiving coastal winds of Victoria’s Great Ocean Road to harsh mid-day sunlight in Queensland—production gear faces acoustic and optical extremes. In this benchmark analysis, we evaluate the real-world operational trade-offs of modern compact cinema rigs.
          </p>
          <p>
            Whether balancing a camera on a pro carbon gimbal like the <Link href="/shop/video/dji-rs-4-pro-gimbal-combo/" className="text-amber-400 underline font-semibold">DJI RS 4 Pro</Link> or dialing in microphone gain stages through the <Link href="/shop/music-audio/sound-devices-mixpre-10-ii-recorder/" className="text-amber-400 underline font-semibold">Sound Devices MixPre-10 II</Link>, proper workflow architecture saves valuable shoot hours.
          </p>

          <h2 className="text-xl sm:text-2xl font-bold text-white uppercase tracking-tight pt-4">
            Optics & Color Science Integration
          </h2>
          <p>
            Camera sensors only deliver their maximum potential when paired with resolving cinema glass. Discover our complete range of cine primes such as the <Link href="/shop/photography/cooke-sp3-5-lens-cine-prime-set/" className="text-amber-400 underline font-semibold">Cooke SP3 Full Frame Primes</Link> and fast autofocus zooms like the <Link href="/shop/photography/sony-fe-24-70mm-f2-8-gm-ii/" className="text-amber-400 underline font-semibold">Sony 24-70mm f/2.8 GM II</Link>.
          </p>
        </div>

        {/* Call to Action Box */}
        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white">Need Technical Gear Advice for Your Shoot?</h3>
            <p className="text-xs text-slate-400">Our Melbourne camera and audio desk is ready to help spec your call sheet requirements.</p>
          </div>
          <Link
            href="/contact/"
            className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider shrink-0 transition"
          >
            Contact Gear Desk
          </Link>
        </div>
      </article>
    </>
  );
}
