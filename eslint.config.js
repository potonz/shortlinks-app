//  @ts-check

import pluginJs from "@eslint/js";
import stylistic from "@stylistic/eslint-plugin";
import { defineConfig, globalIgnores } from "eslint/config";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
    globalIgnores(["dist", ".tanstack", ".wrangler", "**/worker-configuration.d.ts"]),
    {
        files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
        languageOptions: {
            globals: { ...globals.node, ...globals.browser },
        },
    },
    {
        files: ["**/*.{ts,tsx}"],
        languageOptions: {
            sourceType: "module",
            ecmaVersion: 2020,
            parser: tseslint.parser,
            parserOptions: {
                project: true,
                parser: tseslint.parser,
            },
        },
        rules: {
            "@typescript-eslint/consistent-type-imports": [
                "error",
                {
                    fixStyle: "inline-type-imports",
                },
            ],
        },
    },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    {
        plugins: {
            "simple-import-sort": simpleImportSort,
        },
        rules: {
            "simple-import-sort/imports": "error",
            "simple-import-sort/exports": "error",
        },
    },
    stylistic.configs.customize({
        indent: 4,
        semi: true,
        jsx: true,
        quotes: "double",
    }),
    {
        rules: {
            "import/no-anonymous-default-export": "off",
            "@typescript-eslint/consistent-type-imports": [
                "error",
                {
                    fixStyle: "inline-type-imports",
                },
            ],
            "@typescript-eslint/no-unused-vars": "warn",
            "@stylistic/space-before-function-paren": [
                "error",
                {
                    anonymous: "always",
                    named: "never",
                    asyncArrow: "always",
                },
            ],
            "@stylistic/indent": [
                "error",
                4,
                {
                    offsetTernaryExpressions: false,
                    SwitchCase: 1,
                },
            ],
            "no-shadow": "off",
        },
    },
]);
