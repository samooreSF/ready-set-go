module.exports = {
  development: {
    client: 'pg',
    connection: 'postgres://localhost:5432/ready_set_go_development',
    debug: true,
    migrations: {
      tableName: 'knex_migrations',
    }
  },

  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    migrations: {
      tableName: 'knex_migrations',
    },
    pool: {
      min: 2,
      max: 10,
    }
  },
};
