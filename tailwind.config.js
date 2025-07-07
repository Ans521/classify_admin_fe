/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
  proxy : {
    'base' : 'http://82.180.144.143/:4000/api'
  },
  "compilerOptions": {
    "jsx": "react-jsx",
    "allowSyntheticDefaultImports": true
  }

};

export default config;
