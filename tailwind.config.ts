import type { Config } from "tailwindcss";
import typography from '@tailwindcss/typography';

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  mode: 'jit',
  important: true,
  theme: {
    extend: {
      colors: {
        chat: {
          bg: '#343541',
          sidebar: '#202123',
          message: {
            user: '#343541',
            assistant: '#444654',
          },
          input: '#40414f',
        },
      },
    },
  },
  plugins: [typography],
};

export default config; 