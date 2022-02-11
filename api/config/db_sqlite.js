/*
Configuration for local sqlite3 connection
 */
module.exports = {
  database: {
    client: "sqlite3",
    debug: (process.env.NODE_ENV !== 'development'),
    connection: {
      filename: __dirname+"/../../dev.sqlite3"
    }
  },
  mockData: __dirname+'/../db/sqlite3_data.sql',
  directory: __dirname+"/../db/migrations",
  tableName: "knex_version"
};
