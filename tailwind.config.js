/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0f172a', // slate-900
        surface: '#1e293b',    // slate-800
        primary: '#2563eb',    // blue-600
        success: '#16a34a',    // green-600
        warning: '#ca8a04',    // yellow-600
        error: '#dc2626',      // red-600
        mechanic: '#9333ea',   // purple-600
        targeter: '#0891b2',   // cyan-600
        condition: '#ea580c',  // orange-600
      },
    },
  },
  plugins: [],
}
