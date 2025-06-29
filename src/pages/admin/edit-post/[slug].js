import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import slugify from 'slugify';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import withAuth from '../../../components/withAuth';

function EditPost() {
  const router = useRouter();
  const { slug } = router.query;
  const quillRef = useRef(null);
  const editorRef = useRef(null);

  // Add gradient background to edit post page
  useEffect(() => {
    document.body.classList.add('admin-gradient-bg');
    return () => document.body.classList.remove('admin-gradient-bg');
  }, []);
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    slug: ''
  });
  const [originalSlug, setOriginalSlug] = useState('');
  const [originalTitle, setOriginalTitle] = useState('');
  const [isSlugEditable, setIsSlugEditable] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug]);

  // Initialize Quill editor and always show content
  useEffect(() => {
    if (typeof window !== 'undefined' && quillRef.current && !editorRef.current) {
      const quill = new Quill(quillRef.current, {
        theme: 'snow',
        modules: {
          toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            ['blockquote', 'code-block'],
            ['link'],
            [{ 'align': [] }],
            ['clean']
          ],
        },
        formats: [
          'header',
          'bold', 'italic', 'underline', 'strike',
          'list', 'bullet',
          'blockquote', 'code-block',
          'link',
          'align'
        ]
      });

      editorRef.current = quill;

      // Listen for content changes
      quill.on('text-change', () => {
        const content = quill.root.innerHTML;
        setFormData(prev => ({ ...prev, content }));
      });

      // Set initial content if available (always set on mount)
      if (formData.content && formData.content !== '<p><br></p>') {
        setTimeout(() => {
          quill.clipboard.dangerouslyPasteHTML(formData.content);
        }, 100); // slight delay for animation
      }
    }
    // Animate editor fade-in
    if (quillRef.current) {
      quillRef.current.style.opacity = 0;
      quillRef.current.style.transition = 'opacity 0.7s cubic-bezier(0.4,0,0.2,1)';
      setTimeout(() => {
        quillRef.current.style.opacity = 1;
      }, 100);
    }
  }, [formData.content]);

  // Set initial content only when post is first loaded
  useEffect(() => {
    if (editorRef.current && formData.content && !isLoading && originalTitle) {
      // Only set content if the editor is empty or has placeholder content
      const currentContent = editorRef.current.root.innerHTML;
      const isEmpty = currentContent === '<p><br></p>' || currentContent === '' || currentContent.trim() === '';
      
      if (isEmpty && formData.content && formData.content !== '<p><br></p>') {
        // Use Quill's API to set content properly
        editorRef.current.clipboard.dangerouslyPasteHTML(formData.content);
      }
    }
  }, [formData.content, isLoading, originalTitle]); // Run when content is loaded

  // Auto-generate slug when title changes (only if title has changed from original)
  useEffect(() => {
    if (formData.title && originalTitle) {
      const titleChanged = formData.title !== originalTitle;
      
      if (titleChanged) {
        const autoSlug = slugify(formData.title, {
          lower: true,
          strict: true,
          remove: /[*+~.()'"!:@]/g,
        });
        setFormData(prev => ({ ...prev, slug: autoSlug }));
        setIsSlugEditable(true);
      } else {
        // Title is back to original, restore original slug
        setFormData(prev => ({ ...prev, slug: originalSlug }));
        setIsSlugEditable(false);
      }
    }
  }, [formData.title, originalTitle, originalSlug]);

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/posts/${slug}`);
      const data = await response.json();
      
      if (data.success) {
        const post = data.data;
        setFormData({
          title: post.title,
          content: post.content,
          slug: post.slug
        });
        setOriginalSlug(post.slug);
        setOriginalTitle(post.title);
      } else {
        setError(data.error || 'Post not found');
      }
    } catch (error) {
      console.error('Error fetching post:', error);
      setError('An error occurred while fetching the post');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTitleChange = (e) => {
    setFormData(prev => ({ ...prev, title: e.target.value }));
  };

  const handleSlugChange = (e) => {
    setFormData(prev => ({ ...prev, slug: e.target.value }));
  };

  const handleContentChange = (content) => {
    setFormData(prev => ({ ...prev, content }));
  };

  const getQuillContent = () => {
    if (editorRef.current) {
      const content = editorRef.current.root.innerHTML;
      // Update formData with latest content before returning
      setFormData(prev => ({ ...prev, content }));
      return content;
    }
    return formData.content;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    // Validation
    if (!formData.title.trim()) {
      setError('Title is required');
      setIsSubmitting(false);
      return;
    }

    const content = getQuillContent();
    console.log('Submitting content:', content); // Debug log
    
    if (!content.trim() || content === '<p><br></p>') {
      setError('Content is required');
      setIsSubmitting(false);
      return;
    }

    try {
      const payload = {
        title: formData.title.trim(),
        content: content,
        slug: formData.slug
      };
      
      console.log('Sending payload:', payload); // Debug log
      
      const response = await fetch(`/api/posts/${originalSlug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log('Response data:', data); // Debug log

      if (data.success) {
        setSuccess('Post updated successfully!');
        setOriginalSlug(data.data.slug);
        setOriginalTitle(data.data.title);
        
        // If slug changed, redirect to new URL
        if (data.data.slug !== originalSlug) {
          setTimeout(() => {
            router.push(`/admin/edit-post/${data.data.slug}`);
          }, 1000);
        }
      } else {
        setError(data.error || 'Failed to update post');
      }
    } catch (error) {
      console.error('Error updating post:', error);
      setError('An error occurred while updating the post');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/posts/${originalSlug}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        router.push('/admin');
      } else {
        setError(data.error || 'Failed to delete post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      setError('An error occurred while deleting the post');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4DB6AC] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading post...</p>
        </div>
      </div>
    );
  }

  if (error && !formData.title) {
    return (
      <div className="bg-[#F5F5F5] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <svg className="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Post Not Found</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push('/admin')}
            className="inline-flex items-center px-4 py-2 bg-[#4DB6AC] text-white rounded-lg hover:bg-[#FF8A65] transition-colors font-medium"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Admin
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e0eafc] via-[#f9f6ff] to-[#f5f5f5]">
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-12 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 animate-slide-down">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#4DB6AC] tracking-tight" style={{fontFamily: 'Inter, Segoe UI, sans-serif'}}>Edit Post</h2>
            <button
              onClick={handleDelete}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-red-600 text-white font-semibold shadow hover:bg-red-700 transition-all disabled:opacity-50 animate-fade-in"
            >
              Delete Post
            </button>
          </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex">
                  <svg className="w-5 h-5 text-red-400 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex">
                  <svg className="w-5 h-5 text-green-400 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-green-700">{success}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Title Field */}
              <div className="animate-fade-in">
                <label htmlFor="title" className="block text-sm font-semibold text-[#4DB6AC] mb-2">Title *</label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={handleTitleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4DB6AC] focus:border-[#4DB6AC] outline-none transition-all text-base bg-white/90 shadow-sm"
                  placeholder="Enter post title..."
                  required
                />
              </div>

              {/* Slug Field - Editable when title changes */}
              <div className="animate-fade-in">
                <label htmlFor="slug" className="block text-sm font-semibold text-[#4DB6AC] mb-2">Slug {isSlugEditable ? '(Editable - Title Changed)' : '(Read-only)'}</label>
                <input
                  type="text"
                  id="slug"
                  value={formData.slug}
                  onChange={handleSlugChange}
                  readOnly={!isSlugEditable}
                  className={`w-full px-4 py-3 border border-gray-200 rounded-xl outline-none transition-all text-base bg-white/90 shadow-sm ${
                    isSlugEditable 
                      ? 'focus:ring-2 focus:ring-[#4DB6AC] focus:border-[#4DB6AC]' 
                      : 'bg-gray-50 text-gray-600 cursor-not-allowed'
                  }`}
                  placeholder="Slug will be auto-generated from title..."
                />
                <p className="text-xs text-gray-500 mt-1">URL: /blog/{formData.slug || 'your-post-slug'}</p>
                {isSlugEditable && formData.slug !== originalSlug && (
                  <p className="text-xs text-orange-600 mt-1">⚠️ Changing the slug will change the post URL. Old links will no longer work.</p>
                )}
                {!isSlugEditable && (
                  <p className="text-xs text-blue-600 mt-1">💡 Change the title to automatically update the slug, or the slug will remain unchanged for SEO integrity.</p>
                )}
              </div>

              {/* Content Field (Rich Text Editor) */}
              <div className="animate-fade-in">
                <label className="block text-sm font-semibold text-[#4DB6AC] mb-2">Content *</label>
                <div className="border-2 border-[#4DB6AC] rounded-2xl overflow-hidden shadow-lg transition-all duration-500 hover:shadow-2xl">
                  <div
                    ref={quillRef}
                    style={{ minHeight: '300px', background: 'linear-gradient(90deg, #f5f5f5 0%, #fff 100%)' }}
                    className="bg-white quill-animate"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-6 animate-fade-in">
                <button
                  type="submit"
                  disabled={isSubmitting || !formData.title.trim()}
                  className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 focus:scale-105 shadow-md ${
                    isSubmitting || !formData.title.trim()
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-[#4DB6AC] text-white hover:bg-[#FF8A65] hover:shadow-2xl'
                  } animate-fade-in`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating Post...
                    </div>
                  ) : (
                    <span className="transition-all duration-300">Update Post</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </main>
    </div>
  );
}

export default withAuth(EditPost);
