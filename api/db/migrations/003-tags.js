exports.up = function (knex) {
  return knex.schema.createTable('tags', function (t) {
    t.increments('id');
    t.text('tag').notNullable();
    t.timestamp('timestamp').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'));
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('tags');
};
