import { useState, useEffect } from 'react';

export default function About() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
      setDarkMode(true);
      document.body.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const next = !prev;
      if (next) {
        document.body.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.body.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
      return next;
    });
  };

  return (
    <>
      <button
        aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        onClick={toggleDarkMode}
        className="fixed top-6 right-6 z-50 p-2 rounded-full bg-white/80 dark:bg-[#23272e]/80 shadow hover:scale-110 transition-all border border-gray-200 dark:border-[#23272e]"
        style={{ backdropFilter: 'blur(4px)' }}
      >
        {darkMode ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#4DB6AC]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#FF8A65]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m8.66-13.66l-.71.71M4.05 19.95l-.71.71M21 12h-1M4 12H3m16.66 6.66l-.71-.71M4.05 4.05l-.71-.71" />
            <circle cx="12" cy="12" r="5" stroke="#FF8A65" strokeWidth="2" fill="none" />
          </svg>
        )}
      </button>

      <div className="relative min-h-screen bg-gradient-to-br from-[#e0eafc] via-[#f9f6ff] to-[#f5f5f5] flex items-center justify-center py-16">
        <div className="max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 md:p-12 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#222] mb-8 tracking-tight" style={{ fontFamily: 'Inter, Segoe UI, sans-serif' }}>
              About Truly IAS
            </h1>
            <div className="prose prose-lg max-w-none text-gray-700">
              <p className="text-xl mb-6 font-light">
                Welcome to our blog! We're passionate about sharing insights, tutorials, and thoughts on web development, technology, and creative coding.
              </p>

              <h2 className="text-2xl font-bold text-[#4DB6AC] mt-8 mb-4">Our Mission</h2>
              <p className="mb-6">
                Our mission is to create high-quality content that helps developers at all levels improve their skills and stay up-to-date with the latest trends in technology.
              </p>

              <h2 className="text-2xl font-bold text-[#4DB6AC] mt-8 mb-4">What We Cover</h2>
              <ul className="list-disc list-inside mb-6">
                <li>Web Development (React, Next.js, Node.js)</li>
                <li>Modern JavaScript and TypeScript</li>
                <li>CSS and Design Systems</li>
                <li>Database Technologies</li>
                <li>DevOps and Deployment</li>
                <li>Best Practices and Code Quality</li>
              </ul>

              <h2 className="text-2xl font-bold text-[#4DB6AC] mt-8 mb-4">Built With</h2>
              <p className="mb-6">
                This blog is built with modern technologies to ensure fast performance and great user experience:
              </p>
              <ul className="list-disc list-inside mb-6">
                <li><strong>Next.js</strong> - React framework for production</li>
                <li><strong>MongoDB</strong> - NoSQL database for content storage</li>
                <li><strong>Tailwind CSS</strong> - Utility-first CSS framework</li>
                <li><strong>Quill</strong> - Rich text editor for content creation</li>
              </ul>

              <div className="bg-[#f5f7fa] p-6 rounded-xl mt-8 border border-gray-100">
                <p className="text-center text-[#4DB6AC] font-semibold">
                  Thank you for reading Truly IAS! We hope you find our content helpful and engaging.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
