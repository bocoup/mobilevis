/*
  Configuration for local postgres connection
 */
module.exports = {
  database: {
    client: "pg",
    debug: (process.env.NODE_ENV !== 'development'),
    connection: {
      host: "rds.bocoup.com",
      user: "mobilevis",
      database: "mobilevis",
      password: "AZ2NG14iJQhUsVBrF5q469kJ6UlauL2D"
    }
  },
  directory: __dirname+"/../db/migrations",
  tableName: "knex_version"
};
