const mongoose = require('mongoose');
const slugify = require('slugify');
const PostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true }, // HTML content
    slug: { type: String, required: true, unique: true }, // SEO-friendly slug
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Generate slug from title before saving
PostSchema.pre('save', function(next) {
  if (!this.slug || this.isModified('title')) {
    this.slug = slugify(this.title, {
      lower: true,
      strict: true,
      remove: /[*+~.()'"!:@]/g,
    });
  }
  
  this.updatedAt = Date.now();
  next();
});

// Ensure slug is unique by appending number if necessary
PostSchema.pre('save', async function(next) {
  if (!this.isModified('slug')) return next();
  
  const slugRegex = new RegExp(`^${this.slug}(-[0-9]+)?$`, 'i');
  const postsWithSlug = await this.constructor.find({ slug: slugRegex });
  
  if (postsWithSlug.length > 0 && !postsWithSlug.some(post => post._id.equals(this._id))) {
    this.slug = `${this.slug}-${postsWithSlug.length + 1}`;
  }
  
  next();
});

module.exports = mongoose.models.Post || mongoose.model('Post', PostSchema);
