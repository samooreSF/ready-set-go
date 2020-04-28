exports.up = function(knex) {
  return knex.schema.createTable('videos', function(table) {
    table.increments('id').primary();
    table.text('video_link').notNullable();

  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('videos');
};
