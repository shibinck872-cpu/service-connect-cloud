/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: "hsl(224, 71%, 4%)",       // Deep space dark
          secondary: "hsl(223, 64%, 7%)",     // Dark slate
          card: "hsl(222, 47%, 11%)",         // Obsidian card fill
          input: "hsl(223, 47%, 16%)"         // Form fill
        },
        text: {
          primary: "hsl(210, 40%, 98%)",      // Soft ice white
          secondary: "hsl(215, 20%, 65%)",    // Muted cool gray
          muted: "hsl(215, 16%, 47%)"         // Dark gray hints
        },
        accent: {
          teal: "hsl(172, 66%, 50%)",         // Cyber/Tech Teal
          emerald: "hsl(142, 70%, 50%)"       // Production/Healthy Green
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['Fira Code', 'Courier New', 'Courier', 'monospace']
      }
    },
  },
  plugins: [],
}
