/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
  proxy : {
    'base' : 'http://localhost:4000/api'
  },
  "compilerOptions": {
    "jsx": "react-jsx",
    "allowSyntheticDefaultImports": true
  }

};

export default config;
