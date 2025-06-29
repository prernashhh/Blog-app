import Link from 'next/link';
import { formatDate, getExcerpt } from '../utils/helpers';

export default function PostCard({ post }) {
  // Use CSS variables for light/dark mode, but default to light mode colors for SSR and hydration
  return (
    <article
      className="rounded-2xl shadow-md dark:shadow-lg border hover:border-[#4DB6AC] hover:shadow-lg transition-all duration-300 h-full flex flex-col group animate-fade-in overflow-hidden px-4 pt-4 pb-6 md:px-7 md:pt-7 md:pb-10 relative bg-white border-gray-100 dark:bg-[var(--card-bg)] dark:border-[var(--card-border)]"
    >
      {/* Decorative Bubble */}
      <span className="absolute -top-5 -right-5 w-16 h-16 bg-gradient-to-br from-[#4DB6AC]/30 to-[#FF8A65]/30 dark:bg-[var(--bubble)] rounded-full blur-xl opacity-70 z-0 pointer-events-none"></span>
      {/* Post Title */}
      <h2 className="text-2xl md:text-3xl font-bold text-[#222] dark:text-[var(--foreground)] mb-2 md:mb-3 line-clamp-2 transition-colors group-hover:text-[#4DB6AC] tracking-tight" style={{fontFamily: 'Inter, Segoe UI, sans-serif'}}>
        <Link 
          href={`/blog/${post.slug}`}
          className="hover:text-[#4DB6AC] transition-colors"
        >
          {post.title}
        </Link>
      </h2>

      {/* Post Meta */}
      <div className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mb-3 md:mb-4 flex items-center space-x-2">
        <svg className="w-4 h-4 text-[#4DB6AC]" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#E0F7FA"/><path d="M12 7v5l4 2" stroke="#4DB6AC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        <time dateTime={post.createdAt}>
          {formatDate(post.createdAt)}
        </time>
      </div>

      {/* Post Excerpt */}
      <p className="text-[#333333] dark:text-[var(--foreground)] leading-relaxed mb-6 md:mb-7 flex-grow transition-colors group-hover:text-[#666] dark:group-hover:text-gray-300 text-base font-light">
        {getExcerpt(post.content, 140)}
      </p>

      {/* Read More Link */}
      <div className="mt-auto flex justify-end">
        <Link 
          href={`/blog/${post.slug}`}
          className="inline-flex items-center px-5 py-2 rounded-xl bg-[#4DB6AC] text-white font-semibold shadow hover:scale-105 hover:bg-[#FF8A65] transition-all group text-base md:text-lg dark:bg-[var(--accent)] dark:text-[var(--foreground)] dark:hover:bg-[#FF8A65]"
        >
          <span className="mr-2 transition-transform group-hover:translate-x-1">Read More</span>
          <svg 
            className="w-5 h-5 group-hover:translate-x-1 transition-transform" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </article>
  );
}
