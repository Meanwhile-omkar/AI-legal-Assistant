module.exports = {
  extends: ['react-app'],
  plugins: ['unused-imports'],
  rules: {
    // Automatically remove unused imports
    'unused-imports/no-unused-imports': 'error',
    
    // Warn for unused variables but allow ones starting with _
    'unused-imports/no-unused-vars': [
      'warn',
      { vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' },
    ],
  },
};
