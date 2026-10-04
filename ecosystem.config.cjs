module.exports = {
  apps: [
    {
      name: 'wildfire-wiki-api',
      script: './server.js',
      cwd: '/var/www/wiki',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '500M',
      autorestart: true,
      exp_backoff_restart_delay: 100,
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      error_file: '/var/log/wildfire/api-error.log',
      out_file: '/var/log/wildfire/api-out.log',
      merge_logs: true,
      time: true,
    },
  ],
};
