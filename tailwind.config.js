/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pine:     '#10342A',
        radish:   '#E0436B',
        sprout:   '#34C759',
        cream:    '#FAF6EE',
        'cream-2':'#F1EBDD',
        muted:    '#5C7268',
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        body:    ['Space Grotesk', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        h1:      ['72px',  { lineHeight: '1.02' }],
        h2:      ['44px',  { lineHeight: '1.05' }],
        h3:      ['28px',  { lineHeight: '1.2'  }],
        body:    ['17px',  { lineHeight: '1.6'  }],
        small:   ['14px',  { lineHeight: '1.5'  }],
        caption: ['11px',  { lineHeight: '1.4'  }],
      },
      borderRadius: {
        sm:   '8px',
        md:   '14px',
        lg:   '18px',
        pill: '100px',
      },
      boxShadow: {
        sm: '0 1px 4px rgba(16,52,42,.08)',
        md: '0 8px 24px rgba(16,52,42,.12)',
      },
      animation: {
        shimmer: 'shimmer 2s linear infinite',
      },
      keyframes: {
        shimmer: {
          '0%':   { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
    },
  },
  plugins: [],
}
