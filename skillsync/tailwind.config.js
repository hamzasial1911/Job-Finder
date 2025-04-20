/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
        colors: {
          "primary": "#5A9F84",        // A slightly more vibrant green
          "secondary": "#427A5B",      // A complementary darker green
          "accent": "#F2D27E",         // A warm accent color (golden yellow)
          "background": "#F4F7F6",     // A light background color
          "textPrimary": "#333333",    // Dark grey for primary text
          "textSecondary": "#555555",  // Medium grey for secondary text
          "border": "#E0E0E0",         // Light grey for borders
          "error": "#D9534F",          // Red for error messages
          "success": "#5CB85C",        // Green for success messages
          "warning": "#F0AD4E",        // Orange for warning messages
          "info": "#5BC0DE"            // Light blue for informational messages
        }
    },
  },
  plugins: [],
}

