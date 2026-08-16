import js from '@eslint/js'

export default [
  js.configs.recommended,
  { ignores: ['.output', '.nuxt', '.data', 'node_modules', 'public', 'dist', '.certs'] },
  {
    rules: {
      'no-unused-vars': 'off',
      'no-undef': 'off',
      'no-empty': 'off'
    }
  }
]