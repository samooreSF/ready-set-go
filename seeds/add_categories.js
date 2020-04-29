
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('category').del()
    .then(function () {
      // Inserts seed entries
      return knex('category').insert([
        {id: 1, name: 'Dance'},
        {id: 2, name: 'Art'},
        {id: 3, name: 'Music'},
        {id: 4, name: 'Acting'},
        {id: 5, name: 'Food'},
      ]);
    });
};
