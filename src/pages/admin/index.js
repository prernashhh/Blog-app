import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';
import withAuth from '../../components/withAuth';

function AdminDashboard() {
  const router = useRouter();
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Add gradient background to admin dashboard
  useEffect(() => {
    document.body.classList.add('admin-gradient-bg');
    return () => document.body.classList.remove('admin-gradient-bg');
  }, []);

  // Add gradient to main container
  const mainBg = "min-h-screen bg-gradient-to-br from-[#e0eafc] via-[#f9f6ff] to-[#f5f5f5]";

  // Check authentication and fetch posts
  useEffect(() => {
    if (authLoading) return;
    
    if (!isAuthenticated) {
      router.push('/admin/login');
      return;
    }
    
    // Only fetch posts if authenticated
    fetchPosts();
  }, [isAuthenticated, authLoading, router]);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts');
      const data = await response.json();
      
      if (data.success) {
        setPosts(data.data);
      } else {
        setError(data.error || 'Failed to fetch posts');
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError('An error occurred while fetching posts');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (slug) => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/posts/${slug}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setPosts(posts.filter(post => post.slug !== slug));
        setDeleteConfirm(null);
      } else {
        setError(data.error || 'Failed to delete post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      setError('An error occurred while deleting the post');
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const truncateContent = (html, maxLength = 100) => {
    if (typeof window === 'undefined') {
      // Server-side fallback
      const text = html.replace(/<[^>]*>/g, ''); // Strip HTML tags
      return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    }
    
    const div = document.createElement('div');
    div.innerHTML = html;
    const text = div.textContent || div.innerText || '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4DB6AC] mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4DB6AC] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e0eafc] via-[#f9f6ff] to-[#f5f5f5]">
      {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg mx-4 mt-4">
            <div className="flex">
              <svg className="w-5 h-5 text-red-400 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Page Header */}
          <div className="mb-8 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#4DB6AC] mb-2 tracking-tight" style={{fontFamily: 'Inter, Segoe UI, sans-serif'}}>Admin Dashboard</h1>
            <p className="text-gray-600 text-lg">Manage your blog posts and content</p>
          </div>

          {/* Posts Overview */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-10 p-6 md:p-10 animate-slide-down">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
              <h2 className="text-2xl font-bold text-[#222]">Posts Overview</h2>
              <Link
                href="/admin/create-post"
                className="inline-flex items-center px-5 py-2.5 rounded-xl bg-[#4DB6AC] text-white font-semibold shadow hover:scale-105 hover:bg-[#FF8A65] transition-all text-base md:text-lg animate-fade-in"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Post
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-[#E0F7FA] text-[#222] p-6 rounded-xl shadow animate-fade-in">
                <h3 className="text-lg font-semibold mb-2">Total Posts</h3>
                <p className="text-3xl font-bold text-[#4DB6AC]">{posts.length}</p>
              </div>
              <div className="bg-[#FFF3E0] text-[#222] p-6 rounded-xl shadow animate-fade-in">
                <h3 className="text-lg font-semibold mb-2">This Month</h3>
                <p className="text-3xl font-bold text-[#FF8A65]">
                  {posts.filter(post => {
                    const postDate = new Date(post.createdAt);
                    const now = new Date();
                    return postDate.getMonth() === now.getMonth() && postDate.getFullYear() === now.getFullYear();
                  }).length}
                </p>
              </div>
              <div className="bg-[#f5f7fa] text-[#222] p-6 rounded-xl shadow animate-fade-in">
                <h3 className="text-lg font-semibold mb-2">Last Updated</h3>
                <p className="text-sm">
                  {posts.length > 0 
                    ? formatDate(Math.max(...posts.map(post => new Date(post.updatedAt))))
                    : 'No posts yet'
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Posts Table */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden animate-fade-in">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-[#4DB6AC]">All Posts</h3>
            </div>

            {posts.length === 0 ? (
              <div className="p-12 text-center">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No posts yet</h3>
                <p className="text-gray-600 mb-6">Get started by creating your first blog post.</p>
                <Link
                  href="/admin/create-post"
                  className="inline-flex items-center px-4 py-2 bg-[#4DB6AC] text-white rounded-lg hover:bg-[#FF8A65] transition-colors font-medium"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create Your First Post
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-100">
                  <thead className="bg-[#f5f7fa]">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-[#4DB6AC] uppercase tracking-wider">Title</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-[#4DB6AC] uppercase tracking-wider">Content Preview</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-[#4DB6AC] uppercase tracking-wider">Created</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-[#4DB6AC] uppercase tracking-wider">Updated</th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-[#4DB6AC] uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {posts.map((post, idx) => (
                      <tr key={post._id} className="hover:bg-[#f5f7fa] transition-all animate-fade-in" style={{animationDelay: `${idx * 60}ms`}}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <Link
                              href={`/blog/${post.slug}`}
                              className="text-[#4DB6AC] hover:text-[#FF8A65] font-medium"
                            >
                              {post.title}
                            </Link>
                            <p className="text-xs text-gray-400">/{post.slug}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-600 max-w-xs">
                            {typeof window !== 'undefined' ? truncateContent(post.content) : post.content.substring(0, 100) + '...'}
                          </p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(post.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(post.updatedAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <Link
                              href={`/blog/${post.slug}`}
                              className="text-[#4DB6AC] hover:text-[#FF8A65] transition-colors animate-fade-in"
                              title="View"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </Link>
                            <Link
                              href={`/admin/edit-post/${post.slug}`}
                              className="text-[#4DB6AC] hover:text-[#FF8A65] transition-colors animate-fade-in"
                              title="Edit"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </Link>
                            <button
                              onClick={() => setDeleteConfirm(post.slug)}
                              className="text-red-600 hover:text-red-800 transition-colors animate-fade-in"
                              title="Delete"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-[#e0eafc]/70 flex items-center justify-center z-50 animate-fade-in">
            <div className="relative bg-white/95 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl border border-gray-100 animate-slide-up">
              {/* Decorative Bubble */}
              <span className="absolute -top-8 -right-8 w-20 h-20 bg-[#4DB6AC]/20 rounded-full blur-2xl opacity-60 z-0 pointer-events-none"></span>
              <h3 className="text-2xl font-extrabold text-[#4DB6AC] mb-3 tracking-tight drop-shadow-sm z-10 relative" style={{fontFamily: 'Inter, Segoe UI, sans-serif'}}>Confirm Deletion</h3>
              <p className="text-gray-700 mb-7 text-base z-10 relative">Are you sure you want to delete this post? <span className="font-semibold text-[#FF8A65]">This action cannot be undone.</span></p>
              <div className="flex justify-end space-x-4 z-10 relative">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-5 py-2 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900 font-semibold transition-all shadow-sm border border-gray-200"
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeletePost(deleteConfirm)}
                  className="px-5 py-2 rounded-xl bg-[#FF8A65] text-white font-bold shadow hover:scale-105 hover:bg-[#e5735c] transition-all border-none disabled:opacity-60"
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}

export default withAuth(AdminDashboard);
