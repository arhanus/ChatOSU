import type { Config } from "tailwindcss";
import typography from '@tailwindcss/typography';

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
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