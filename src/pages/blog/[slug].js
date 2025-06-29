import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { formatDate, getExcerpt, getReadingTime } from '../../utils/helpers';
import ReadingProgressBar from '../../components/ReadingProgressBar';

export default function BlogPost({ post, error }) {
  const [tocItems, setTocItems] = useState([]);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Generate table of contents from headings
  useEffect(() => {
    if (post?.content && typeof window !== 'undefined') {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = post.content;
      const headings = tempDiv.querySelectorAll('h1, h2, h3, h4, h5, h6');
      const items = Array.from(headings).map((heading, index) => ({
        id: `heading-${index}`,
        text: heading.textContent,
        level: parseInt(heading.tagName.substring(1)),
      }));
      setTocItems(items);
      setTimeout(() => {
        const actualHeadings = document.querySelectorAll('.blog-content h1, .blog-content h2, .blog-content h3, .blog-content h4, .blog-content h5, .blog-content h6');
        actualHeadings.forEach((heading, index) => {
          heading.id = `heading-${index}`;
        });
      }, 100);
    }
  }, [post?.content]);

  // Bookmark state
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
      setIsBookmarked(bookmarks.some(p => p._id === post._id));
    }
  }, [post?._id]);

  function handleBookmark() {
    if (typeof window === 'undefined') return;
    let bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    if (bookmarks.some(p => p._id === post._id)) {
      bookmarks = bookmarks.filter(p => p._id !== post._id);
      setIsBookmarked(false);
    } else {
      bookmarks.push(post);
      setIsBookmarked(true);
    }
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    window.dispatchEvent(new Event('storage'));
  }

  if (error) {
    return (
      <>
        <Head>
          <title>Post Not Found | My Blog</title>
          <meta name="description" content="The requested blog post could not be found." />
        </Head>
        <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-[#333333] mb-4">404 - Post Not Found</h1>
            <p className="text-gray-600 mb-8">{error}</p>
            <Link 
              href="/"
              className="inline-flex items-center px-6 py-3 bg-[#4DB6AC] text-white rounded-lg hover:bg-[#FF8A65] transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </>
    );
  }

  const readingTime = getReadingTime(post.content);
  const description = getExcerpt(post.content, 155);

  return (
    <>
      <Head>
        <title>{post.title} | My Blog</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/blog/${post.slug}`} />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content={post.title} />
        <meta property="twitter:description" content={description} />
        
        {/* Article specific */}
        <meta property="article:published_time" content={post.createdAt} />
        <meta property="article:modified_time" content={post.updatedAt} />
      </Head>

      <ReadingProgressBar />

      <div className="min-h-screen bg-gradient-to-br from-[#e0eafc] via-[#f9f6ff] to-[#f5f5f5] pb-16 overflow-x-hidden relative">
        {/* Floating SVG Accent */}
        <svg className="absolute -top-32 -left-32 w-[32rem] h-[32rem] opacity-25 blur-2xl pointer-events-none" viewBox="0 0 400 400" fill="none">
          <circle cx="200" cy="200" r="200" fill="#4DB6AC" fillOpacity="0.18" />
        </svg>
        <div className="flex max-w-7xl mx-auto pt-12 lg:pt-20 animate-fade-in relative z-10">
          {/* Table of Contents - Sticky Sidebar */}
          {tocItems.length > 2 && (
            <aside className="hidden lg:block w-72 p-8 sticky top-28 h-fit">
              <div className="bg-white/90 rounded-2xl shadow-xl p-6 border border-gray-100">
                <h3 className="font-semibold text-[#333333] mb-4 text-lg tracking-wide">Table of Contents</h3>
                <nav>
                  <ul className="space-y-2">
                    {tocItems.map((item) => (
                      <li key={item.id}>
                        <a
                          href={`#${item.id}`}
                          className={`block text-sm hover:text-[#4DB6AC] transition-colors ${
                            item.level === 1 ? 'font-semibold text-[#333333]' :
                            item.level === 2 ? 'text-gray-700 pl-4' :
                            'text-gray-500 pl-8'
                          }`}
                        >
                          {item.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </aside>
          )}
          {/* Main Content */}
          <main className="flex-1 max-w-3xl mx-auto px-2 sm:px-6 lg:px-8 py-4 lg:py-12">
            <article className="bg-white/95 rounded-3xl shadow-2xl border border-gray-100 p-6 sm:p-10 lg:p-16 animate-slide-down relative overflow-hidden">
              {/* Accent Gradient Bar */}
              <div className="absolute left-0 top-0 w-full h-2 bg-gradient-to-r from-[#4DB6AC] via-[#FF8A65] to-[#4DB6AC] rounded-t-3xl mb-6" />
              {/* Article Header */}
              <header className="mb-10">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                  <h1 className="text-4xl lg:text-5xl xl:text-6xl font-extrabold text-[#222] leading-tight tracking-tight drop-shadow-sm">
                    {post.title}
                  </h1>
                  {/* Bookmark Button */}
                  <button
                    onClick={handleBookmark}
                    className={`group flex items-center px-5 py-2.5 rounded-xl border-2 transition-all shadow-md focus:outline-none font-semibold text-lg ${isBookmarked ? 'bg-[#4DB6AC]/10 border-[#4DB6AC] text-[#4DB6AC]' : 'bg-white border-gray-200 text-gray-400 hover:bg-gray-50 hover:border-[#4DB6AC] hover:text-[#4DB6AC]'}`}
                    aria-label={isBookmarked ? 'Remove Bookmark' : 'Add Bookmark'}
                  >
                    <svg
                      className={`w-7 h-7 mr-2 transition-all ${isBookmarked ? 'fill-[#4DB6AC] stroke-[#4DB6AC]' : 'fill-none stroke-current'}`}
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      fill={isBookmarked ? '#4DB6AC' : 'none'}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 5v14l7-7 7 7V5a2 2 0 00-2-2H7a2 2 0 00-2 2z" />
                    </svg>
                    <span>{isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
                  </button>
                </div>
                <div className="flex flex-wrap items-center gap-6 text-base text-gray-600 mb-4">
                  <span className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-[#4DB6AC]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {formatDate(post.createdAt)}
                  </span>
                </div>
              </header>
              {/* Article Content */}
              <div 
                className="blog-content prose prose-lg max-w-none text-[#222] animate-fade-in"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
              {/* Article Footer */}
              <footer className="mt-14 pt-8 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <p className="text-base text-gray-500">
                  Last updated: <span className="text-[#4DB6AC] font-medium">{formatDate(post.updatedAt)}</span>
                </p>
                <Link href="/" className="inline-flex items-center px-6 py-2 rounded-lg bg-[#4DB6AC] text-white font-semibold shadow hover:bg-[#FF8A65] transition-colors">
                  ← Back to Home
                </Link>
              </footer>
            </article>
          </main>
        </div>
      </div>
    </>
  );
}

export async function getStaticPaths() {
  try {
    const dbConnect = require('../../lib/mongodb');
    const Post = require('../../models/Post');
    
    await dbConnect();
    const posts = await Post.find({}).select('slug').lean();
    
    const paths = posts.map((post) => ({
      params: { slug: post.slug },
    }));

    return {
      paths,
      fallback: 'blocking', // Enable ISR
    };
  } catch (error) {
    console.error('Error in getStaticPaths:', error);
    return {
      paths: [],
      fallback: 'blocking',
    };
  }
}

export async function getStaticProps({ params }) {
  try {
    const dbConnect = require('../../lib/mongodb');
    const Post = require('../../models/Post');
    
    await dbConnect();
    const post = await Post.findOne({ slug: params.slug }).lean();
    
    if (!post) {
      return {
        notFound: true,
      };
    }

    // Convert MongoDB ObjectId to string for serialization
    const serializedPost = {
      ...post,
      _id: post._id.toString(),
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
    };

    return {
      props: {
        post: serializedPost,
      },
      revalidate: 60, // Revalidate every minute
    };
  } catch (error) {
    console.error('Error fetching post:', error);
    return {
      props: {
        error: 'Failed to load post',
      },
    };
  }
}
