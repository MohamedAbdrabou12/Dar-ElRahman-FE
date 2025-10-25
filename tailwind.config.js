/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // enable manual dark mode toggle
  content: ["./src/**/*.{html,ts,scss}"],

  safelist: [
    // Toast background colors
    'bg-green-50', 'bg-red-50', 'bg-yellow-50', 'bg-blue-50',
    // Toast borders
    'border-green-300', 'border-red-300', 'border-yellow-300', 'border-blue-300',
    // Toast text colors
    'text-green-800', 'text-red-800', 'text-yellow-800', 'text-blue-800',
  ],
  theme: {
    extend: {
      colors: {
        // Primary & Secondary
        primary: "#2fa469",
        secondary: "#0b3460",
        hover: "#27985b",

        // Status Colors
        success: "#22c55e",
        warning: "#f59f00",
        error: "#e43535",

        // Light Mode Base
        text: "#1e1e1e",
        // background: "#dde5b6",
        background: "#f8f7f3",

        // Dark Mode
        "dark-primary": "#32c47d",
        "dark-secondary": "#1f3b57",
        "dark-hover": "#40d48c",
        "dark-success": "#37e580",
        "dark-warning": "#facc15",
        "dark-error": "#ef4444",
        "dark-text": "#e9ecef",
        "dark-background": "#0c1118",
        "dark-surface": "#18212b",
        "dark-border": "#24303e",

        // Green Palette
        "green-lightest": "#EEF9F4",
        "green-lighter": "#AFE0B8",
        "green-light": "#73C982",
        green: "#2FA469",
        "green-dark": "#267D36",
        "green-darker": "#1E622A",
        "green-darkest": "#154C1F",

        // Accent Colors
        orange: "#F9A806",
        "orange-light": "#FCD277",
        "orange-dark": "#C07B00",

        yellow: "#F8BC4C",
        "yellow-light": "#FCE6A2",
        "yellow-dark": "#D08700",

        // Neutral Shades
        "shade-0": "#000000",
        "shade-6": "#2a2f34",
        "shade-12": "#4b5258",
        "shade-18": "#7c8288",
        "shade-23": "#b9bec4",
        "shade-25": "#e1e5e8",
        "shade-26": "#ffffff",
      },
      fontFamily: {
        cairo: ["Cairo", "sans-serif"],
      },
      keyframes: {
        "fade-in-up": {
          "0%": { opacity: 0, transform: "translateY(20px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        "fade-in-right": {
          "0%": { opacity: 0, transform: "translateX(20px)" },
          "100%": { opacity: 1, transform: "translateX(0)" },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up 0.6s ease-out",
        "fade-in-right": "fade-in-right 0.6s ease-out",
      },
    },
  },
  plugins: [],
};



























// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: [
//     "./src/**/*.{html,ts,scss}"
//   ],
//   theme: {
//     extend: {
//       colors: {
//         background: "var(--color-background)",
//         primary: "var(--color-primary)",
//         secondary: "var(--color-secondary)",
//         hover: "var(--color-hover)",
//         success: "var(--color-success)",
//         warning: "var(--color-warning)",
//         error: "var(--color-error)",
//         text: "var(--color-text)",
//       },
//       fontFamily: {
//         cairo: ['var(--font-family)', "sans-serif"],
//       },
//     },
//   },
//   darkMode: "class",
//   plugins: [],
// };
