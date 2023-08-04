/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTableIfNotExists("bank_info",function(table){
    table.bigIncrements('id').primary();
table.string('cname',50);
table.integer('ac_no');
table.dateTime('ac_open');
table.string('ifsc',20);
table.boolean('have_loan');
table.integer('phone');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    
    return knex.schema.dropTableIfExists('bank_info')
  
};
