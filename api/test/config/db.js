module.exports = {
  database: {
    client: "sqlite3",
    debug: false,
    connection: {
      filename: ':memory:'
    }
  },
  directory: __dirname+"/../../db/migrations",
  tableName: "knex_version"
};
