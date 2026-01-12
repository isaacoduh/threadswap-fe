module.exports = {
  root: true,
  extends: [
    "next/core-web-vitals",
    "plugin:prettier/recommended" // enables eslint-plugin-prettier + disables conflicting rules
  ],
  rules: {
    // Keep this minimal; add rules as the codebase grows.
    "prettier/prettier": ["warn"]
  }
};