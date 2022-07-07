module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    node: true,
    jest: true,
  },
  ignorePatterns: ["node_modules/", ".eslintrc.*", "package.json"],
  extends: ["eslint:recommended", "plugin:prettier/recommended"],
  rules: {
    "prettier/prettier": [
      "error",
      {
        endOfLine: "auto",
      },
    ],
    "prefer-arrow-callback": ["error", { "allowNamedFunctions": true }],
    "no-const-assign": ["error"],
    "no-dupe-else-if": ["error"],
    "no-unused-vars": ["off"],
    "no-irregular-whitespace": ["error"],
    "curly": ["warn"],
    "eqeqeq": ["warn"],
    "no-var": ["error"],
    "prefer-const": ["warn"],
    "prefer-destructuring": ["warn"],
  },
  parserOptions: {
    parser: "babel-parser",
    sourceType: "module",
    allowImportExportEverywhere: true,
  },
};
