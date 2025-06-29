import { useEffect, useState } from 'react';
import PostCard from '../components/PostCard';

export default function Bookmarks() {
  const [bookmarked, setBookmarked] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    setBookmarked(saved);
    document.body.classList.add('admin-gradient-bg');
    return () => document.body.classList.remove('admin-gradient-bg');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e0eafc] via-[#f9f6ff] to-[#f5f5f5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-[#333333] mb-8">Bookmarked Posts</h1>
        {bookmarked.length === 0 ? (
          <div className="text-center text-gray-500">No bookmarks yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {bookmarked.map(post => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
