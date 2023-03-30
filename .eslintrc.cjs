module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  plugins: [
    'vue',
  ],
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-strongly-recommended',
  ],
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'no-undef': 'off',
    'vue/require-explicit-emits': 'off',
  },
  overrides: [
    {
      files: [
        '**/layouts/**/*.vue',
        '**/pages/**/*.vue',
        '**/error.vue',
      ],
      rules: {
        'vue/multi-word-component-names': 'off',
      },
    },
  ],
};
