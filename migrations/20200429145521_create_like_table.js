
exports.up = function(knex) {
  return knex.schema.createTable('likes', function(table) {
    table.increments('id').primary();
    table.integer('challenge_id').unique().notNullable().references('category.id');
    table.integer('user_id').unique().notNullable().references('users.id');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('likes');

};
