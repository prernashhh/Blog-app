// import { useState, useEffect } from 'react';
import PostCard from '../components/PostCard';
import React from 'react';

export default function Home({ posts, error }) {
  // Dark mode temporarily disabled for deployment
  const [searchTerm, setSearchTerm] = React.useState('');

  // Filter posts based on search term
  const filteredPosts = posts?.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Posts</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Dark/Light Mode Toggle removed for deployment */}
      {/* Hero Section */}
      <section
        className="relative border-b animate-fade-in overflow-hidden bg-gradient-to-br from-[#e0eafc] via-[#f9f6ff] to-[#f5f5f5] border-gray-100"
        style={{ background: 'linear-gradient(135deg, #e0eafc 0%, #f9f6ff 50%, #f5f5f5 100%)' }}
      >
        {/* Floating SVG Accent */}
        <svg
          className="absolute -top-24 -left-24 w-96 h-96 opacity-30 blur-2xl pointer-events-none transition-colors duration-500"
          viewBox="0 0 400 400" fill="none"
        >
          <circle
            cx="200"
            cy="200"
            r="200"
            fill="#4DB6AC"
            fillOpacity="0.18"
          />
        </svg>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center relative z-10">
          <h1
            className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-7 animate-slide-down tracking-tight drop-shadow-xl text-[#222]"
            style={{fontFamily: 'Inter, Segoe UI, sans-serif'}}
          >
            Welcome to <span className="bg-gradient-to-r from-[#4DB6AC] to-[#FF8A65] bg-clip-text text-transparent">Truly IAS</span>
          </h1>
          <p
            className="text-2xl mb-10 max-w-3xl mx-auto animate-fade-in font-light text-gray-700"
          >
            Discover insightful articles, tutorials, and thoughts on web development, technology, and creative coding.
          </p>
          {/* Search Bar */}
          <div className="max-w-md mx-auto animate-fade-in">
            <div className="relative">
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-5 py-4 pl-14 rounded-2xl focus:ring-2 focus:ring-[#4DB6AC] focus:border-transparent outline-none transition-all shadow-lg hover:shadow-2xl text-lg bg-white/80 border-gray-200 text-[#222] placeholder-gray-500"
                style={{backdropFilter: 'blur(6px)'}}
              />
              <svg
                className="absolute left-5 top-1/2 transform -translate-y-1/2 h-6 w-6 text-[#4DB6AC]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Posts Section */}
      <section
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20 bg-[#f7f7fa]"
        style={{ background: '#f7f7fa', boxShadow: '0 8px 32px 0 rgba(77,182,172,0.04)' }}
      >
        {filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3v8m0 0V9a2 2 0 00-2-2H9m0 0v8m0 0V9a2 2 0 00-2-2H5" />
            </svg>
            <h3 className="text-lg font-medium text-[#333333] mb-2">
              {searchTerm ? 'No posts found' : 'No posts available'}
            </h3>
            <p className="text-gray-600">
              {searchTerm 
                ? `No posts match "${searchTerm}". Try different keywords.`
                : 'Check back later for new content!'
              }
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="mt-4 text-[#4DB6AC] hover:text-[#FF8A65] transition-colors font-medium"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-4 mt-0">
              <h2 className="text-3xl font-bold text-[#333333]">
                {searchTerm ? `Search Results (${filteredPosts.length})` : 'Latest Articles'}
              </h2>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="text-sm text-[#4DB6AC] hover:text-[#FF8A65] transition-colors font-medium"
                >
                  Show all posts
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {filteredPosts.map((post, idx) => (
                <div key={post._id} className="animate-fade-in" style={{ animationDelay: `${idx * 80}ms` }}>
                  <PostCard post={post} />
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}

export async function getServerSideProps() {
  try {
    const dbConnect = require('../lib/mongodb');
    const Post = require('../models/Post');
    
    await dbConnect();
    const posts = await Post.find({})
      .sort({ createdAt: -1 })
      .lean();
    
    // Serialize the posts for JSON
    const serializedPosts = posts.map(post => ({
      ...post,
      _id: post._id.toString(),
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
    }));
    
    return {
      props: {
        posts: serializedPosts,
      },
    };
  } catch (error) {
    console.error('Error fetching posts:', error);
    return {
      props: {
        posts: [],
        error: error.message || 'Failed to load posts',
      },
    };
  }
}
