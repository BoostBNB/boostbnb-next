import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // ...compat.extends("next/core-web-vitals", "next/typescript"),
  // {
  //   rules: {
  //     "no-explicit-any": "off",
  //     "no-unused-vars": "warn",
  //     "react-hooks/exhaustive-deps": "warn",
  //     "react/n-unescaped-entities": "off",
  //   }
  // }
  {}
];

export default eslintConfig;
