import Head from 'next/head';
import Link from 'next/link';
// import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/router';

export default function Layout({ children, title = 'Truly IAS', description = 'A minimalist blog built with Next.js' }) {
  const { user, logout } = useAuth();
  const router = useRouter();

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen flex transition-colors duration-500 bg-[#F5F5F5] dark:bg-[#181a20]" id="__trulyias-root">
        {/* Sidebar - Collapsible */}
        <aside className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-[#23272e] shadow-lg border-r border-gray-100 dark:border-[#23272e] z-50 transition-colors duration-500" id="__trulyias-sidebar">
          <div className="flex flex-col h-full overflow-y-auto">
            {/* Logo (no arrow) */}
            <div className="flex items-center h-16 px-4 border-b border-gray-100 dark:border-[#23272e] flex-shrink-0 transition-all duration-300 relative bg-white dark:bg-[#23272e]">
              <Link href="/" className="flex items-center space-x-2 group flex-1">
                <img src="/blog-logo.svg" alt="Truly IAS Logo" className="w-9 h-9 transition-transform duration-300 group-hover:scale-110" />
                <span className="text-2xl font-bold transition-colors duration-300 group-hover:text-[#4DB6AC] text-[#333] dark:text-[#f5f5f5]">Truly IAS</span>
              </Link>
            </div>
            {/* Navigation */}
            <nav className="flex-1 px-2 py-6 overflow-y-auto">
              <div className="flex flex-col gap-2 w-full">
                <Link 
                  href="/" 
                  className="flex items-center py-3 px-4 font-medium group rounded-lg transition-all duration-300
                    text-[#333333] dark:text-[#f5f5f5] hover:text-[#4DB6AC] dark:hover:text-[#4DB6AC]
                    hover:bg-gray-50 dark:hover:bg-[#23272e]/70 bg-white dark:bg-[#23272e]"
                >
                  <svg className="w-6 h-6 text-gray-400 dark:text-gray-500 group-hover:text-[#4DB6AC] transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span className="ml-3">Home</span>
                </Link>
                <Link 
                  href="/about" 
                  className="flex items-center py-3 px-4 font-medium group rounded-lg transition-all duration-300
                    text-[#333333] dark:text-[#f5f5f5] hover:text-[#4DB6AC] dark:hover:text-[#4DB6AC]
                    hover:bg-gray-50 dark:hover:bg-[#23272e]/70 bg-white dark:bg-[#23272e]"
                >
                  <svg className="w-6 h-6 text-gray-400 dark:text-gray-500 group-hover:text-[#4DB6AC] transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="ml-3">About</span>
                </Link>
                <Link 
                  href="/contact" 
                  className="flex items-center py-3 px-4 font-medium group rounded-lg transition-all duration-300
                    text-[#333333] dark:text-[#f5f5f5] hover:text-[#4DB6AC] dark:hover:text-[#4DB6AC]
                    hover:bg-gray-50 dark:hover:bg-[#23272e]/70 bg-white dark:bg-[#23272e]"
                >
                  <svg className="w-6 h-6 text-gray-400 dark:text-gray-500 group-hover:text-[#4DB6AC] transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="ml-3">Contact</span>
                </Link>
                <Link 
                  href="/bookmarks" 
                  className="flex items-center py-3 px-4 text-[#333333] hover:text-[#4DB6AC] hover:bg-gray-50 rounded-lg transition-all font-medium group"
                >
                  <svg className="w-6 h-6 text-gray-400 group-hover:text-[#4DB6AC] transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5v14l7-7 7 7V5a2 2 0 00-2-2H7a2 2 0 00-2 2z" />
                  </svg>
                  <span className="ml-3">Bookmarks</span>
                </Link>
                <div className="border-t border-gray-200 my-4"></div>
                {user ? (
                  <>
                    <Link 
                      href="/admin" 
                      className="flex items-center py-3 px-4 text-[#FF8A65] hover:text-[#4DB6AC] hover:bg-gray-50 rounded-lg transition-all font-medium group"
                    >
                      <svg className="w-6 h-6 text-[#FF8A65] group-hover:text-[#4DB6AC] transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="ml-3">Admin Dashboard</span>
                    </Link>
                    <button 
                      onClick={() => logout()}
                    className="flex items-center w-full py-3 px-4 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all font-medium group"
                    >
                      <svg className="w-6 h-6 text-red-500 group-hover:text-red-600 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                    <span className="ml-3">Logout</span>
                    </button>
                  </>
                ) : (
                  <Link 
                    href="/admin/login" 
                    className="flex items-center py-3 px-4 text-[#4DB6AC] hover:text-[#FF8A65] hover:bg-gray-50 rounded-lg transition-all font-medium group"
                  >
                    <svg className="w-6 h-6 text-[#4DB6AC] group-hover:text-[#FF8A65] transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    <span className="ml-3">Admin Login</span>
                  </Link>
                )}
              </div>
            </nav>
            {/* Footer in sidebar */}
            <div className="p-4 border-t border-gray-100 flex-shrink-0">
              <p className="text-xs text-gray-500 text-center mb-3">
                &copy; {new Date().getFullYear()} Truly IAS
              </p>
            </div>
          </div>
        </aside>
        {/* Main content area with proper margin for fixed sidebar */}
        <div className="flex-1 lg:ml-64">
          {/* Main Content - Scrollable */}
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </>
  );
}
