/*
  Configuration for local postgres connection
 */
module.exports = {
  database: {
    client: "pg",
    debug: (process.env.NODE_ENV !== 'development'),
    connection: {
      host: "localhost",
      user: "bocoup",
      database: "mobilevis"
    }
  },
  directory: __dirname+"/../db/migrations",
  tableName: "knex_version"
};