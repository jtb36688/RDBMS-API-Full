
exports.seed = function(knex, Promise) {
  return knex('cohorts')
  .truncate()
    .then(function () {
      return knex('cohorts').insert([
        {name: 'FSW16'},
        {name: 'FSW17'},
        {name: 'IOS10'},
        {name: 'CS15'}
      ]);
    });
};
