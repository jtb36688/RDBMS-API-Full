
exports.seed = function(knex, Promise) {
  return knex('table_name')
  .truncate()
    .then(function () {
      return knex('table_name').insert([
        {id: 1, colName: 'rowValue1'},
        {id: 2, colName: 'rowValue2'},
        {id: 3, colName: 'rowValue3'}
      ]);
    });
};
