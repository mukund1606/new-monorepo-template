/** @typedef {import("prettier").Config} PrettierConfig */
/** @typedef {import("prettier-plugin-tailwindcss").PluginOptions} TailwindConfig */
/** @typedef {import("@ianvs/prettier-plugin-sort-imports").PluginConfig} SortImportsConfig */

/** @type { PrettierConfig | SortImportsConfig | TailwindConfig  } */
const config = {
  tabWidth: 2,
  semi: true,
  printWidth: 90,
  singleQuote: false,
  endOfLine: "lf",
  trailingComma: "all",
  plugins: [
    "@ianvs/prettier-plugin-sort-imports",
    "prettier-plugin-tailwindcss",
    "prettier-plugin-packagejson",
  ],
  tailwindAttributes: ["classNames"],
  tailwindFunctions: ["cva", "clsx", "cn"],
  importOrder: [
    "<TYPES>",
    "<THIRD_PARTY_MODULES>",
    "",
    "<TYPES>^@acme",
    "^@acme/(.*)$",
    "",
    "<TYPES>^[.|..|~]",
    "^~/",
    "^[../]",
    "^[./]",
  ],
  importOrderParserPlugins: ["typescript", "jsx", "decorators-legacy"],
  importOrderTypeScriptVersion: "5.9.2",
};

export default config;
