module.exports = {
  plugins: [require.resolve('prettier-plugin-astro'), require.resolve('prettier-plugin-css-order')],
  overrides: [
    {
      files: '*.astro',
      options: {
        parser: 'astro',
      },
    },
  ],
  arrowParens: 'always',
  endOfLine: 'auto',
  printWidth: 100,
  singleQuote: true,
  trailingComma: 'all',
};
