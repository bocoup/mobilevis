exports.up = function (knex) {
  return knex.schema.createTable('comments', function (t) {
    t.increments('id');
    t.text('twitter_handle');
    t.text('comment').notNullable();
    t.integer('submission_id').references('id').inTable('submissions').notNullable();
    t.timestamp('timestamp').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'));
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('comments');
};