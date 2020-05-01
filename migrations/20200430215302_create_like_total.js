exports.up = function(knex) {
  return knex.schema.table('likes', function(table) {
    table.integer('likeTotal').nullable();
  });
};

exports.down = function(knex) {
  return knex.schema.table('likes', function(table) {
    table.dropColumn('likeTotal').nullable();
  });
};
