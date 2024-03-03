module.exports = {
  extends: ['internal'],
  ignorePatterns: ['./coverage'],
  overrides: [
    {
      files: ['*.test.ts'],
      plugins: ['jest'],
      extends: ['plugin:jest/recommended'],
      env: {
        'jest/globals': true,
      },
    },
  ],
}
