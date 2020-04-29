exports.up = function(knex) {
  return knex.schema.alterTable('challenges', function(table) {
    table.integer('video_id').notNullable().alter();
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable('challenges', function(table) {
    table.integer('video_id').nullable().alter();
  });
};
