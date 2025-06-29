import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import slugify from 'slugify';
import { useAuth } from '../../contexts/AuthContext';
import withAuth from '../../components/withAuth';

function CreatePost() {
  const router = useRouter();
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const quillRef = useRef(null);
  const editorRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    slug: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Check authentication
  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, authLoading, router]);

  // Auto-generate slug when title changes
  useEffect(() => {
    if (formData.title) {
      const autoSlug = slugify(formData.title, {
        lower: true,
        strict: true,
        remove: /[*+~.()'"!:@]/g,
      });
      setFormData(prev => ({ ...prev, slug: autoSlug }));
    } else {
      setFormData(prev => ({ ...prev, slug: '' }));
    }
  }, [formData.title]);

  // Initialize Quill (Client-side only)
  useEffect(() => {
    const loadEditor = async () => {
      if (typeof window !== 'undefined' && quillRef.current && !editorRef.current) {
        const Quill = (await import('quill')).default;
        await import('quill/dist/quill.snow.css');

        const quill = new Quill(quillRef.current, {
          theme: 'snow',
          placeholder: 'Write your post content here...',
          modules: {
            toolbar: [
              [{ 'header': [1, 2, 3, false] }],
              ['bold', 'italic', 'underline', 'strike'],
              [{ 'list': 'ordered' }, { 'list': 'bullet' }],
              ['blockquote', 'code-block'],
              ['link'],
              [{ 'align': [] }],
              ['clean']
            ],
          },
          formats: [
            'header', 'bold', 'italic', 'underline', 'strike',
            'list', 'bullet', 'blockquote', 'code-block',
            'link', 'align'
          ]
        });

        editorRef.current = quill;

        quill.on('text-change', () => {
          const content = quill.root.innerHTML;
          setFormData(prev => ({ ...prev, content }));
        });
      }
    };

    loadEditor();
  }, []);

  const handleTitleChange = (e) => {
    setFormData(prev => ({ ...prev, title: e.target.value }));
  };

  const getQuillContent = () => {
    return editorRef.current ? editorRef.current.root.innerHTML : formData.content;
  };

  const clearEditor = () => {
    if (editorRef.current) {
      editorRef.current.setContents([]);
      setFormData(prev => ({ ...prev, content: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    if (!formData.title.trim()) {
      setError('Title is required');
      setIsSubmitting(false);
      return;
    }

    const content = getQuillContent();
    if (!content.trim() || content === '<p><br></p>') {
      setError('Content is required');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title.trim(),
          content: getQuillContent(),
          slug: formData.slug
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Post created successfully!');
        setFormData({ title: '', content: '', slug: '' });
        clearEditor();

        setTimeout(() => {
          router.push(`/blog/${data.data.slug}`);
        }, 2000);
      } else {
        setError(data.error || 'Failed to create post');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      setError('An error occurred while creating the post');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#F5F5F5] min-h-screen">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-3xl font-bold text-[#333333] mb-8">Create New Post</h2>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title Field */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-[#333333] mb-2">Title *</label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={handleTitleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4DB6AC] focus:border-transparent outline-none"
                placeholder="Enter post title..."
                required
              />
            </div>

            {/* Slug Field */}
            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-[#333333] mb-2">Slug (Auto-generated)</label>
              <input
                type="text"
                id="slug"
                value={formData.slug}
                readOnly
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                placeholder="Slug will be auto-generated from title"
              />
              <p className="text-xs text-gray-500 mt-1">URL: /blog/{formData.slug || 'your-post-slug'}</p>
            </div>

            {/* Content Field */}
            <div>
              <label className="block text-sm font-medium text-[#333333] mb-2">Content *</label>
              <div className="border border-gray-300 rounded-lg overflow-hidden">
                <div ref={quillRef} style={{ minHeight: '300px' }} className="bg-white" />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6">
              <button
                type="submit"
                disabled={isSubmitting || !formData.title.trim()}
                className={`px-8 py-3 rounded-lg font-medium transition-all ${
                  isSubmitting || !formData.title.trim()
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-[#4DB6AC] text-white hover:bg-[#FF8A65] shadow-md hover:shadow-lg'
                }`}
              >
                {isSubmitting ? 'Creating...' : 'Create Post'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default withAuth(CreatePost);
