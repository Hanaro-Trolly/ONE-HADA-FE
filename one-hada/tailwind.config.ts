import type { Config } from 'tailwindcss';
import animate from 'tailwindcss-animate';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        'main-background': 'rgb(var(--main-background) / <alpha-value>)',
        foreground: 'hsl(var(--foreground))',
        'main-green': 'rgb(var(--main-green) / <alpha-value>)',
        'sub-green': 'rgb(var(--sub-green) / <alpha-value>)',
        register: 'rgb(var(--register) / <alpha-value>)',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'bounce-slow': {
          '0%, 100%': {
            transform: 'translateY(-10%)',
            animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)',
          },
          '50%': {
            transform: 'translateY(0)',
            animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)',
          },
        },
        'scale-pulse': {
          '0%, 100%': {
            transform: 'scale(1)',
            filter:
              'brightness(0.8) sepia(0.4) saturate(200%) hue-rotate(120deg)',
          },
          '50%': {
            transform: 'scale(1.1)',
            filter:
              'brightness(0.8) sepia(0.4) saturate(200%) hue-rotate(120deg)',
          },
        },
        'ping-small': {
          '75%, 100%': {
            transform: 'scale(1.2)',
            opacity: '0',
          },
        },
        'error-bounce': {
          '0%, 100%': { transform: 'translateY(0) scale(1)' },
          '50%': { transform: 'translateY(-5px) scale(1.1)' },
        },
      },
      animation: {
        'bounce-slow': 'bounce-slow 1.5s infinite',
        'scale-pulse': 'scale-pulse 1.5s ease-in-out infinite',
        'ping-small': 'ping-small 1s cubic-bezier(0, 0, 0.2, 1) infinite',
        'error-icon': 'error-bounce 2s ease-in-out infinite',
      },
    },
  },
  plugins: [animate],
};

export default config;
