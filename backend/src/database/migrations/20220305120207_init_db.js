/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async (knex) => {
    await knex.schema.createTable("users", (table) => {
        table.increments("id");
        table.string("name").unique().notNullable();
        table.string("email").unique().notNullable();
        table.boolean("email_is_confirmed").notNullable().defaultTo(false);
        table.string("email_confirmation_code", 6);
        table.string("password");
        table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
        table.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());
        table
            .enu("role", ["user", "editor", "admin"])
            .defaultTo("user")
            .notNullable();
    });

    await knex.schema.createTable("photos", (table) => {
        table.increments("id");
        table.string("photo_path").notNullable();
        table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
        table.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());
    });

    await knex.schema.createTable("products", (table) => {
        table.increments("id");
        table.string("title").notNullable();
        table.string("author").notNullable();
        table.integer("amount").notNullable();
        table.integer("price").notNullable();
        table.integer("photo_id");
        table
            .foreign("photo_id")
            .references("photos.id")
            .onDelete("CASCADE")
            .onUpdate("CASCADE");
    });

    

    await knex.schema.createTable("orders", (table) => {
        table.increments("id");
        table.integer("user_id").notNullable();
        table.integer("price").notNullable();
        table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
        table.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());
        table
            .foreign("user_id")
            .references("users.id")
            .onDelete("CASCADE")
            .onUpdate("CASCADE");
        
    });
    
    await knex.schema.createTable("orders_products", (table) => {
        table.integer("order_id").notNullable();
        table.integer("product_id").notNullable();
        table.integer("amount").notNullable();
        table
            .foreign("product_id")
            .references("products.id")
            .onDelete("SET NULL")
            .onUpdate("CASCADE");
        table
            .foreign("order_id")
            .references("orders.id")
            .onDelete("CASCADE")
            .onUpdate("CASCADE");
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async (knex) => {
    await knex.schema.dropTableIfExists("orders");
    await knex.schema.dropTableIfExists("products");
    await knex.schema.dropTableIfExists("orders_products");
    await knex.schema.dropTableIfExists("photos");
    await knex.schema.dropTableIfExists("users");

};
