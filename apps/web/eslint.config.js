import baseConfig, { restrictEnvAccess } from "@acme/eslint-config/base";
import reactConfig from "@acme/eslint-config/react";

export default [...baseConfig, ...restrictEnvAccess, ...reactConfig];
