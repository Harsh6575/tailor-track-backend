import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier";

export default tseslint.config(
  // base recommended configs
  eslint.configs.recommended,
  ...tseslint.configs.recommended,

  // ignored files
  {
    ignores: ["dist", "node_modules", ".husky", ".drizzle", "vitest.config.ts", "src/**/*.test.ts"],
  },

  // custom rules
  {
    files: ["**/*.ts"],
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "no-console": "warn",
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    },
  },

  // prettier last
  prettier
);
