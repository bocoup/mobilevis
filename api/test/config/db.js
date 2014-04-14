module.exports = {
  database: {
    client: "sqlite3",
    debug: false,
    connection: {
      filename: __dirname+ "/../../test.sqlite3"
    }
  },
  directory: __dirname+"/../../db/migrations",
  tableName: "knex_version"
};