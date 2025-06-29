import dbConnect from '../../../lib/mongodb';
import Post from '../../../models/Post';

export default async function handler(req, res) {
  const {
    query: { slug },
    method,
  } = req;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const post = await Post.findOne({ slug }).lean();
        if (!post) {
          return res.status(404).json({ success: false, error: 'Post not found' });
        }
        res.status(200).json({ success: true, data: post });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case 'PUT':
      try {
        const { title, content, slug: newSlug } = req.body;
        
        // Validation
        if (!title || !title.trim()) {
          return res.status(400).json({ success: false, error: 'Title is required' });
        }
        if (!content || !content.trim() || content === '<p><br></p>') {
          return res.status(400).json({ success: false, error: 'Content is required' });
        }
        
        // Check if slug already exists (only if it's different from current post)
        if (newSlug && newSlug !== slug) {
          const existingPost = await Post.findOne({ slug: newSlug });
          if (existingPost) {
            return res.status(400).json({ success: false, error: 'A post with this slug already exists' });
          }
        }
        
        const updateData = {
          title: title.trim(),
          content: content.trim(),
          updatedAt: new Date()
        };
        
        // Only update slug if it's provided and different
        if (newSlug && newSlug !== slug) {
          updateData.slug = newSlug;
        }
        
        const post = await Post.findOneAndUpdate(
          { slug },
          updateData,
          { new: true, runValidators: true }
        );
        
        if (!post) {
          return res.status(404).json({ success: false, error: 'Post not found' });
        }
        
        res.status(200).json({ success: true, data: post });
      } catch (error) {
        console.error('Error updating post:', error);
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case 'DELETE':
      try {
        const deletedPost = await Post.findOneAndDelete({ slug });
        if (!deletedPost) {
          return res.status(404).json({ success: false, error: 'Post not found' });
        }
        res.status(200).json({ success: true, data: {} });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
