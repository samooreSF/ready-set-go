exports.up = function(knex) {
  return knex.schema.alterTable('likes', function(table) {
    table.dropUnique('user_id');
    table.dropUnique('challenge_id');
    table.unique(['user_id', 'challenge_id']);
  });
}

exports.down = function(knex) {
  return knex.schema.alterTable('likes', function(table) {
    table.unique('user_id');
    table.unique('challenge_id');
    table.dropUnique(['user_id', 'challenge_id']);
  });
}
