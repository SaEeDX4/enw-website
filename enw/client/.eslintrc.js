module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:jsx-a11y/recommended',
    'prettier',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react', 'jsx-a11y'],
  rules: {
    'react/prop-types': 'off',
    'jsx-a11y/no-autofocus': 'off',
    'jsx-a11y/anchor-is-valid': 'warn',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
