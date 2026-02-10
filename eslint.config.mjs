import { defineConfig, globalIgnores } from "eslint/config";
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import react from "@eslint-react/eslint-plugin";
import nextPlugin from "@next/eslint-plugin-next";

export default defineConfig([
  // Global ignores
  globalIgnores([
    ".next/**",
    "out/**",
    "coverage/**",
    "qa-screenshots/**",
    "node_modules/**",
  ]),

  // Base JS recommended rules
  js.configs.recommended,

  // TypeScript: parser + recommended rules
  ...tseslint.configs.recommended,

  // React rules (ESLint 10 compatible)
  {
    files: ["**/*.{ts,tsx}"],
    ...react.configs["recommended-typescript"],
  },

  // Next.js specific rules
  {
    plugins: { "@next/next": nextPlugin },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
    },
  },

  // TypeScript file overrides
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      "no-undef": "off",
    },
  },

  // shadcn/ui components - relax React 19 migration rules
  {
    files: ["src/ui/**/*.{ts,tsx}"],
    rules: {
      "@eslint-react/no-forward-ref": "off",
      "@eslint-react/no-use-context": "off",
      "@eslint-react/no-context-provider": "off",
      "@eslint-react/no-clone-element": "off",
      "@eslint-react/no-children-to-array": "off",
    },
  },

  // Project-specific rules
  {
    rules: {
      "no-console": "warn",
      "no-debugger": "error",
      "prefer-const": "error",
      "no-var": "error",

      // TypeScript
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-empty-object-type": "off",

      // React - relax noisy rules
      "@eslint-react/hooks-extra/no-direct-set-state-in-use-effect": "off",
    },
  },
]);
