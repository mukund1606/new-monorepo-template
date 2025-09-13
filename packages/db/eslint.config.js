import baseConfig, { restrictEnvAccess } from "@acme/eslint-config/base";

export default [...baseConfig, ...restrictEnvAccess];
