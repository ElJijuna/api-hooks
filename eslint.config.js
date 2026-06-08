import eslintJest from 'super-configs/eslint/jest';
import eslintReactTsx from 'super-configs/eslint/react/tsx';

export default [
  {
    ignores: [
      '**/coverage/**',
      '**/dist/**',
      '**/docs/**',
      '**/node_modules/**',
      'package-lock.json',
    ],
  },
  ...eslintReactTsx,
  ...eslintJest,
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/consistent-type-imports': 'warn',
    },
  },
];
