exports.up = function (knex) {
  return knex.schema.table('submissions', function (t) {
    t.text('description');
  });
};

exports.down = function (knex) {
  return knex.schema.table('submissions', function (t) {
    t.dropColumn('description');
  });
};
