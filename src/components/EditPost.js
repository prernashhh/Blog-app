import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/router';
import slugify from 'slugify';
import withAuth from './withAuth';

function EditPost() {
  const router = useRouter();
  const { slug } = router.query;
  const quillRef = useRef(null);
  const editorRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    document.body.classList.add('admin-gradient-bg');
    return () => {
      document.body.classList.remove('admin-gradient-bg');
    };
  }, []);

  const [formData, setFormData] = useState({ title: '', content: '', slug: '' });
  const [originalSlug, setOriginalSlug] = useState('');
  const [originalTitle, setOriginalTitle] = useState('');
  const [isSlugEditable, setIsSlugEditable] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchPost = useCallback(async () => {
    try {
      const res = await fetch(`/api/posts/${slug}`);
      const data = await res.json();
      if (data.success) {
        const post = data.data;
        setFormData({ title: post.title, content: post.content, slug: post.slug });
        setOriginalSlug(post.slug);
        setOriginalTitle(post.title);
      } else {
        setError(data.error || 'Post not found');
      }
    } catch (err) {
      console.error('Error fetching post:', err);
      setError('An error occurred while fetching the post');
    } finally {
      setIsLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    if (slug) fetchPost();
  }, [slug, fetchPost]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    import('quill/dist/quill.snow.css');
    import('quill').then(({ default: Quill }) => {
      if (quillRef.current && !editorRef.current) {
        const quill = new Quill(quillRef.current, {
          theme: 'snow',
          modules: {
            toolbar: [
              [{ header: [1, 2, 3, false] }],
              ['bold', 'italic', 'underline', 'strike'],
              [{ list: 'ordered' }, { list: 'bullet' }],
              ['blockquote', 'code-block'],
              ['link'],
              [{ align: [] }],
              ['clean'],
            ],
          },
          formats: [
            'header', 'bold', 'italic', 'underline', 'strike',
            'list', 'bullet', 'blockquote', 'code-block',
            'link', 'align',
          ],
        });
        editorRef.current = quill;

        quill.on('text-change', () => {
          setFormData(prev => ({ ...prev, content: quill.root.innerHTML }));
        });

        if (formData.content && formData.content !== '<p><br></p>') {
          setTimeout(() => {
            quill.clipboard.dangerouslyPasteHTML(formData.content);
          }, 100);
        }

        quillRef.current.style.opacity = 0;
        quillRef.current.style.transition = 'opacity 0.7s cubic-bezier(0.4,0,0.2,1)';
        setTimeout(() => {
          quillRef.current.style.opacity = 1;
        }, 100);
      }
    });
  }, [formData.content]);

  useEffect(() => {
    if (typeof window === 'undefined' || !editorRef.current || isLoading || !originalTitle) return;

    const current = editorRef.current.root.innerHTML;
    if ((current === '<p><br></p>' || !current.trim()) && formData.content) {
      editorRef.current.clipboard.dangerouslyPasteHTML(formData.content);
    }
  }, [formData.content, isLoading, originalTitle]);

  useEffect(() => {
    if (!formData.title || !originalTitle) return;
    const changed = formData.title !== originalTitle;
    if (changed) {
      const autoSlug = slugify(formData.title, { lower: true, strict: true, remove: /[*+~.()'"!:@]/g });
      setFormData(prev => ({ ...prev, slug: autoSlug }));
      setIsSlugEditable(true);
    } else {
      setFormData(prev => ({ ...prev, slug: originalSlug }));
      setIsSlugEditable(false);
    }
  }, [formData.title, originalTitle, originalSlug]);

  const handleTitleChange = e => setFormData(prev => ({ ...prev, title: e.target.value }));
  const handleSlugChange = e => setFormData(prev => ({ ...prev, slug: e.target.value }));
  const getQuillContent = () => editorRef.current ? editorRef.current.root.innerHTML : formData.content;

  const handleSubmit = async e => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    if (!formData.title.trim()) return setError('Title is required'), setIsSubmitting(false);

    const content = getQuillContent();
    if (!content.trim() || content === '<p><br></p>') {
      setError('Content is required');
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch(`/api/posts/${originalSlug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: formData.title.trim(), content, slug: formData.slug }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess('Post updated successfully!');
        setOriginalSlug(data.data.slug);
        setOriginalTitle(data.data.title);
        if (data.data.slug !== originalSlug) {
          setTimeout(() => router.push(`/admin/edit-post/${data.data.slug}`), 1000);
        }
      } else {
        setError(data.error || 'Failed to update post');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred while updating the post');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure?')) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/posts/${originalSlug}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) router.push('/admin');
      else setError(data.error || 'Failed to delete post');
    } catch (err) {
      console.error(err);
      setError('An error occurred while deleting the post');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (error && !formData.title) return <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>;

  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-gray-100 to-white">
      <h1 className="text-3xl font-bold text-center mb-6 text-teal-600">Edit Post</h1>
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
      {success && <p className="text-green-500 mb-4 text-center">{success}</p>}
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow space-y-6">
        <div>
          <label htmlFor="title" className="block mb-1 font-medium text-gray-700">Title</label>
          <input
            id="title"
            type="text"
            value={formData.title}
            onChange={handleTitleChange}
            className="w-full border px-4 py-2 rounded-lg"
            required
          />
        </div>
        <div>
          <label htmlFor="slug" className="block mb-1 font-medium text-gray-700">Slug</label>
          <input
            id="slug"
            type="text"
            value={formData.slug}
            onChange={handleSlugChange}
            readOnly={!isSlugEditable}
            className="w-full border px-4 py-2 rounded-lg bg-gray-100"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium text-gray-700">Content</label>
          <div ref={quillRef} style={{ minHeight: 250 }} className="bg-white" />
        </div>
        <div className="flex justify-between">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-teal-600 text-white px-6 py-2 rounded hover:bg-teal-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Updating...' : 'Update Post'}
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isSubmitting}
            className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 disabled:opacity-50"
          >
            Delete
          </button>
        </div>
      </form>
    </div>
  );
}

export default withAuth(EditPost);
