exports.up = function (knex) {
  return knex.schema.createTable('submission_tags', function (t) {
    t.increments('id');
    t.integer('tag_id').references('id').inTable('tags').notNullable();
    t.integer('submission_id').references('id').inTable('submissions').notNullable();
    t.timestamp('timestamp').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'));
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('submission_tags');
};
