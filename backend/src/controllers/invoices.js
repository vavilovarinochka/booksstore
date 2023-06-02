const checkout = require("../utils/checkout");
const ControllerException = require("../utils/ControllerException");
const knex = require("../utils/db");

// creates new invoice if not exists
exports.createInvoice = async ({ user_id, order }) => {
    try {
        const [record] = await knex("invoices").where({ order_id: order.id }).select("*");
        if (!record) {
            await knex("invoices")
                .insert([{ order_id: order.id, user_id, status: "pending" }])
                .returning("*");
        }

        const { status, confirmation, paid } = await checkout(order);
        if (paid) {
            await knex("invoices").update({ status: status }).where({ order_id: order.id });
            return;
        }

        return { status, confirmation, paid };
    } catch (error) {
        console.log(error);
        throw new ControllerException("ERROR", "something went wrong and this is bad");
    }
};

// TODO: rewrite this functions
// update an order
exports.updateOrder = async ({ users_id, price }) => {
    try {
        const [record] = await knex("orders").update({ users_id, price }).where({ id: orderId });

        return record;
    } catch (error) {
        console.log(error);
    }
};

// get an order by id
exports.getOrderById = async ({ orderId }) => {
    const [{ id, users_id, price }] = await knex("orders")
        .select("id", "users_id", "price")
        .where({ id: orderId });

    return { id, users_id, products, amount, price };
};

// get list orders
exports.getOrders = async ({ limit, offset }) => {
    // const records = await knex("orders_products")
    //     .innerJoin('orders', { 'orders.id': 'orders_products.order_id' })
    //     .innerJoin('products', { 'products.id': 'orders_products.product_id' })
    //     // .select("orders.id", 'products.title as product_name', "products.price", 'orders_products.amount as amount', 'orders.user_id')
    //     .options({ nestTables: true })
    //     .select("*")
    //     .limit(limit)
    //     .offset(offset);

    const records = await knex("orders")
        .innerJoin("orders_products", { "orders_products.order_id": "orders.id" })
        .innerJoin("products", { "products.id": "orders_products.product_id" })
        .innerJoin("users", { "users.id": "user_id" })
        .select(
            "orders.id",
            "orders.price as total_price",
            "products.title as product_name",
            "products.price",
            "orders_products.amount as amount",
            "name as client_name"
        )
        .limit(limit)
        .offset(offset);

    const test = Object.values(groupByKey(records, "id"));

    // const records = await knex('users')
    //     .leftJoin('user_addresses', 'users.id', '=', 'user_addresses.user_id')
    //     .select([
    //         'users.*',
    //         knext.raw(
    //             "case when count(user_addresses) = 0 then '[]' else json_agg(user_addresses.*) end",
    //         ),
    //     ])
    //     .groupBy(['users.id', 'user_addresses.user_id'])
    //     .first();

    return test;
};

// get list orders
exports.getUserRelatedOrders = async ({ userId, limit, offset }) => {
    const records = await knex("orders")
        .innerJoin("orders_products", { "orders_products.order_id": "orders.id" })
        .innerJoin("products", { "products.id": "orders_products.product_id" })
        .innerJoin("users", { "users.id": "user_id" })
        .select(
            "orders.id",
            "orders.price as total_price",
            "products.title as product_name",
            "products.price",
            "orders_products.amount as amount",
            "name as client_name"
        )
        .where("users.id", userId)
        .limit(limit)
        .offset(offset);

    const test = Object.values(groupByKey(records, "id"));

    // const records = await knex('users')
    //     .leftJoin('user_addresses', 'users.id', '=', 'user_addresses.user_id')
    //     .select([
    //         'users.*',
    //         knext.raw(
    //             "case when count(user_addresses) = 0 then '[]' else json_agg(user_addresses.*) end",
    //         ),
    //     ])
    //     .groupBy(['users.id', 'user_addresses.user_id'])
    //     .first();

    return test;
};

// delete an order
exports.deleteOrder = async ({ orderId }) => {
    const record = await knex("orders").select("id").where({ id: orderId });

    if (!record) {
        throw new ControllerException("NOT_FOUND", "Order has not been found");
    }

    await knex("orders").where({ id: orderId }).del();

    return { message: "order is deleted" };
};
