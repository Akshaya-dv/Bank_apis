// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {

  development: {
    client: 'postgresql',
    connection: {
      user: 'postgres',
      host: 'localhost',
      database: 'postgres',
      password: '1234'
    },
    migrations: {
      directory: './db/migrations', // Replace with your migrations directory path
    },
    seeds: {
      directory: './db/seeds', // Replace with your seeds directory path
    },
  },

  staging: {
    client: 'postgresql',
    connection: {
      user: 'postgres',
      host: 'localhost',
      database: 'postgres',
      password: '1234'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'postgresql',
    connection: {
      user: 'postgres',
      host: 'localhost',
      database: 'postgres',
      password: '1234'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
