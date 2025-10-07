import baseConfig, { restrictEnvAccess } from "@acme/eslint-config/base";
import reactConfig from "@acme/eslint-config/react";

/** @type {import("eslint").Linter.Config[]} */
const config = [...baseConfig, ...restrictEnvAccess, ...reactConfig];

export default config;
