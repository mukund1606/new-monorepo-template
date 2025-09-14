module.exports = {
  apps: [
    {
      name: "server",
      script: "bun",
      args: "apps/server/dist/index.js",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
      },
    },
    {
      name: "web",
      script: "bun",
      args: "apps/web/.output/server/index.mjs",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: 3001,
      },
    },
  ],
};
