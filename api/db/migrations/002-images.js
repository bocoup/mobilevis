exports.up = function (knex) {
  return knex.schema.createTable('images', function (t) {
    t.increments('id');
    t.integer('submission_id').references('id').inTable('submissions').notNullable();
    t.text('url').notNullable();
    t.timestamp('timestamp').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'));
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('images');
};
