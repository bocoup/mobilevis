exports.up = function (knex) {
  return knex.schema.createTable('submissions', function (t) {
    t.increments('id').primary();
    t.text('twitter_handle').notNullable();
    t.text('name').notNullable();
    t.text('creator');
    t.text('original_url');
    t.text('description');
    t.timestamp('timestamp').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'));
    t.boolean('is_published').defaultTo(false);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('submissions');
};
