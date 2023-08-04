const { table } = require("console");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
     return knex.schema.alterTable("public.bank_info", function (table) {
        table.integer('balance'); 
        table.integer('years');
        table.integer('interest').defaultTo(5);
      
      });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    
    return knex.schema.alterTable("public.bank_info", function (table) {
        table.dropColumn('balance');
        table.dropColumn('years');
        table.dropColumn('interest');
      });
};
