/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ["eslint:recommended"],
  env: { node: true, es2022: true },
  ignorePatterns: ["dist", "node_modules"],
};
