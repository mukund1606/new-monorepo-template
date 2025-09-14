import baseConfig, {
  drizzleEslintConfig,
  restrictEnvAccess,
} from "@acme/eslint-config/base";

export default [...baseConfig, ...restrictEnvAccess, ...drizzleEslintConfig];
