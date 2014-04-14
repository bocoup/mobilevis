module.exports = {
  database: {
    client: "pg",
    debug: (process.env.NODE_ENV !== 'development'),
    connection: {
      host: "localhost",
      user: "mobilevis",
      database: "mobilevis",
      password: "bocoupbocoup"
    }
  },
  directory: __dirname+"/../db/migrations",
  tableName: "knex_version"
};