const { Pool } = require('pg');

const pool = new Pool({
  user: 'app_user',
  host: 'localhost',
  database: 'my_app_db',
  password: 'secure_password',
  port: 5432,
});

