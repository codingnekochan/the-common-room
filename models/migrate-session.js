const { execSync } = require('node:child_process');

execSync(`psql "${process.env.CONNECTION_STRING}" < node_modules/connect-pg-simple/table.sql`, {
  stdio: 'inherit'
});