exports.up = function(knex) {
  return knex.schema.table('challenges', function(table) {
    table.integer('category_id').notNullable().references('category.id');
  });
};

exports.down = function(knex) {
  return knex.schema.table('challenges', function(table) {
    table.dropColumn('category_id');
  });
};
