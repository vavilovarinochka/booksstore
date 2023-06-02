/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async (knex) => {
    await knex.schema.createTable("users", (table) => {
        table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
        table.string("name").unique().notNullable();
        table.string("email").unique().notNullable();
        table.boolean("email_is_confirmed").notNullable().defaultTo(false);
        table.string("email_confirmation_code", 6);
        table.string("password");
        table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
        table.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());
        table
            .enu("role", ["user", "editor", "admin"])
            .notNullable()
            .defaultTo("user")
    });

    await knex.schema.createTable("photos", (table) => {
        table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
        table.string("photo_path").notNullable();
        table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
        table.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());
    });

    await knex.schema.createTable("products", (table) => {
        table.uuid("id",).primary().defaultTo(knex.raw("gen_random_uuid()"));
        table.string("title").notNullable();
        table.string("author").notNullable();
        table.integer("amount").notNullable();
        table.integer("price").notNullable();
        table.uuid("photo_id");
        table
            .foreign("photo_id")
            .references("photos.id")
            .onDelete("CASCADE")
            .onUpdate("CASCADE");
    });

    await knex.schema.createTable("orders", (table) => {
        table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
        table.increments("number");
        table.uuid("user_id").notNullable();
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
        table.uuid("order_id").notNullable();
        table.uuid("product_id").notNullable();
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

    await knex.schema.createTable("invoices", (table) => {
        table.uuid("order_id").notNullable();
        table.uuid("user_id").notNullable();
        table.enum("status", ['pending', 'succeeded', 'canceled']).notNullable().defaultTo('pending')
        table
            .foreign("user_id")
            .references("users.id")
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
    await knex.schema.dropTableIfExists("invoices");
    await knex.schema.dropTableIfExists("orders_products");
    await knex.schema.dropTableIfExists("orders");
    await knex.schema.dropTableIfExists("products");
    await knex.schema.dropTableIfExists("photos");
    await knex.schema.dropTableIfExists("users");

};
