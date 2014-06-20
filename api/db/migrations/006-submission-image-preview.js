exports.up = function (knex) {
  return knex.schema.table('images', function (t) {
    t.boolean('isPreview').defaultTo('false');
    t.string('previewOffset');
  });
};

exports.down = function (knex) {
  return knex.schema.table('images', function(t) {
    t.dropColumn('isPreview');
    t.dropColumn('previewOffset');
  });
};
