// import { useState, useEffect } from 'react';

export default function About() {
  // Dark mode temporarily disabled for deployment

  return (
    <>
      {/* Dark/Light Mode Toggle removed for deployment */}

      <div className="relative min-h-screen bg-gradient-to-br from-[#e0eafc] via-[#f9f6ff] to-[#f5f5f5] flex items-center justify-center py-16">
        <div className="max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 md:p-12 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#222] mb-8 tracking-tight" style={{ fontFamily: 'Inter, Segoe UI, sans-serif' }}>
              About Truly IAS
            </h1>
            <div className="prose prose-lg max-w-none text-gray-700">
              <p className="text-xl mb-6 font-light">
                {`Welcome to our blog! We're passionate about sharing insights, tutorials, and thoughts on web development, technology, and creative coding.`}
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
