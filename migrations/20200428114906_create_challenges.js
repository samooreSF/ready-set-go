exports.up = function(knex) {
  return knex.schema.createTable('challenges', function(table) {
    table.increments('id').primary();
    table.integer('user_id').notNullable().references('users.id');
    table.text('title').notNullable();
    table.text('caption');
    table.integer('video_id').references('videos.id');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('challenges');
};
