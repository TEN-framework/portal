// Suppress @property warnings from PostCSS
const originalWarn = console.warn;
console.warn = (...args) => {
  if (typeof args[0] === 'string' && args[0].includes('Unknown at rule')) {
    return;
  }
  originalWarn(...args);
};

export default {
  plugins: {
    '@tailwindcss/postcss': {}
  }
}
