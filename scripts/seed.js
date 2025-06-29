require('dotenv').config({ path: '.env.local' });
const slugify = require('slugify');
const dbConnect = require('../src/lib/mongodb'); // using CommonJS require
const Post = require('../src/models/Post'); // using CommonJS require

const samplePosts = [
  {
    title: "Getting Started with Next.js and MongoDB",
    content: `
      <h2>Welcome to the Blog!</h2>
      <p>Next.js is a powerful React framework for building fast, user-friendly web applications. MongoDB is a flexible, document-based database that pairs perfectly with JavaScript apps.</p>
      <h3>Why Next.js?</h3>
      <ul>
        <li>Server-side rendering for SEO</li>
        <li>API routes for backend logic</li>
        <li>File-based routing</li>
      </ul>
      <h3>Connecting to MongoDB</h3>
      <p>Use the <code>mongoose</code> library to connect your Next.js app to MongoDB. Store your blog posts, users, and more!</p>
      <blockquote>"The best way to get started is to build something!"</blockquote>
    `,
    author: "Admin",
    status: "published",
    tags: ["Next.js", "MongoDB", "Web Development", "Tutorial"],
    featured: true,
  },
  {
    title: "Understanding React Hooks: A Comprehensive Guide",
    content: `
      <h2>React Hooks Demystified</h2>
      <p>Hooks let you use state and other React features without writing a class. The most common hooks are <code>useState</code> and <code>useEffect</code>.</p>
      <h3>useState Example</h3>
      <pre><code>const [count, setCount] = useState(0);</code></pre>
      <h3>useEffect Example</h3>
      <pre><code>useEffect(() =&gt; &#123; /* side effect */ &#125;, [dependencies]);</code></pre>
      <p>Hooks make your components cleaner and easier to test.</p>
    `,
    author: "Admin",
    status: "published",
    tags: ["React", "JavaScript", "Hooks", "Frontend"],
    featured: false,
  },
  {
    title: "Building Responsive Layouts with Tailwind CSS",
    content: `
      <h2>Responsive Design with Tailwind</h2>
      <p>Tailwind CSS makes it easy to build responsive layouts using utility classes. Use <code>sm:</code>, <code>md:</code>, <code>lg:</code>, and <code>xl:</code> prefixes for breakpoints.</p>
      <ul>
        <li><code>flex flex-col md:flex-row</code> for stacking on mobile, row on desktop</li>
        <li><code>p-4 md:p-8</code> for padding adjustments</li>
      </ul>
      <p>Try resizing your browser to see the effect!</p>
    `,
    author: "Admin",
    status: "published",
    tags: ["CSS", "Tailwind", "Responsive Design", "Frontend"],
    featured: true,
  },
  {
    title: "API Design Best Practices with Node.js",
    content: `
      <h2>Designing Robust APIs</h2>
      <p>Good API design is crucial for maintainable backend systems. Use RESTful conventions, proper status codes, and clear error messages.</p>
      <h3>Tips:</h3>
      <ul>
        <li>Use nouns for endpoints: <code>/posts</code>, <code>/users</code></li>
        <li>Support filtering, sorting, and pagination</li>
        <li>Document your API with OpenAPI/Swagger</li>
      </ul>
    `,
    author: "Admin",
    status: "published",
    tags: ["Node.js", "API", "Backend", "Best Practices"],
    featured: false,
  },
  {
    title: "Modern JavaScript Features You Should Know",
    content: `
      <h2>ES6+ Features</h2>
      <p>Modern JavaScript (ES6 and beyond) brings many new features:</p>
      <ul>
        <li>Arrow functions: <code>() => {}</code></li>
        <li>Destructuring: <code>const { a, b } = obj;</code></li>
      <li>Template literals: <code>\`Hello, \${name}!\`</code></li>
        <li>Async/await for promises</li>
        <li>Spread/rest operators</li>
      </ul>
      <p>Use these features to write cleaner, more concise code!</p>
    `,
    author: "Admin",
    status: "published",
    tags: ["JavaScript", "ES6", "Modern Development", "Programming"],
    featured: false,
  }
];

// Add slug to each post
samplePosts.forEach(post => {
  post.slug = slugify(post.title, {
    lower: true,
    strict: true,
    remove: /[*+~.()'"!:@]/g,
  });
});

async function seedDatabase() {
  try {
    await dbConnect();
    await Post.deleteMany({});
    console.log('Cleared existing posts');

    const createdPosts = await Post.insertMany(samplePosts);
    console.log(`Created ${createdPosts.length} sample posts`);

    createdPosts.forEach(post => {
      console.log(`- ${post.title} (slug: ${post.slug})`);
    });

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
