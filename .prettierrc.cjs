module.exports = {
  plugins: [require.resolve('prettier-plugin-astro')],
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
