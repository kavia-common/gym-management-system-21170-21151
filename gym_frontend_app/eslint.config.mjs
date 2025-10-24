import pluginJs from '@eslint/js';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import pluginJsxA11y from 'eslint-plugin-jsx-a11y';
import pluginImport from 'eslint-plugin-import';

export default [
  // Target common file types in this repo
  { files: ['**/*.{js,mjs,cjs,jsx,ts,tsx}'] },
  pluginJs.configs.recommended,
  {
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true }
      },
      // Declare common globals to avoid noisy no-undef for browser APIs and CRA test env
      globals: {
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        fetch: 'readonly',
        Headers: 'readonly',
        URL: 'readonly',
        URLSearchParams: 'readonly',
        FormData: 'readonly',
        Blob: 'readonly',
        WebSocket: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        console: 'readonly',
        process: 'readonly',
        TextDecoder: 'readonly',
        TextEncoder: 'readonly',
        Response: 'readonly',
        // testing
        test: 'readonly',
        expect: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly'
      }
    },
    plugins: {
      react: pluginReact,
      'react-hooks': pluginReactHooks,
      'jsx-a11y': pluginJsxA11y,
      import: pluginImport
    },
    rules: {
      // React and hooks
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
      'react/jsx-uses-vars': 'error',
      'react/prop-types': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // General JS
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: 'React|App' }],
      'no-empty': ['warn', { allowEmptyCatch: true }],
      'no-unsafe-finally': 'warn',
      'no-prototype-builtins': 'off', // allow use in legacy util code
      'no-misleading-character-class': 'warn',
      'no-useless-escape': 'warn',

      // Import hygiene
      'import/order': [
        'warn',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true }
        }
      ],
      'import/no-unresolved': 'off' // let TS/CRA handle resolution
    },
    settings: {
      react: {
        version: 'detect'
      }
    }
  }
];
