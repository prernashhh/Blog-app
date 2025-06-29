/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#F5F5F5',
        foreground: '#333333',
        accent: '#4DB6AC',
        highlight: '#FF8A65',
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: '#333333',
            h1: {
              color: '#333333',
            },
            h2: {
              color: '#333333',
            },
            h3: {
              color: '#333333',
            },
            h4: {
              color: '#333333',
            },
            h5: {
              color: '#333333',
            },
            h6: {
              color: '#333333',
            },
            a: {
              color: '#4DB6AC',
              '&:hover': {
                color: '#FF8A65',
              },
            },
            blockquote: {
              borderLeftColor: '#4DB6AC',
              color: '#666666',
            },
            code: {
              color: '#333333',
              backgroundColor: '#F5F5F5',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
