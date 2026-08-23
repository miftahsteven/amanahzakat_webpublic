module.exports = {
  apps: [
    {
      name: "amanahzakat-web",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 7036",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "600M",
      env: {
        NODE_ENV: "production",
        PORT: 7036,
        NEXT_PUBLIC_API_BASE_URL: "https://portal.amanahzakat.id/api/v1/public",
      },
    },
  ],
};
