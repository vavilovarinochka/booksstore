const knex = require("./db");
const checkout = require("./checkout");

const checkInvoiceStatus = async () => {
    try {
        const records = await knex("invoices")
            .innerJoin("orders", { "orders.id": "invoices.order_id" })
            .select("*");

        if (!records) {
            console.log("All invoices are checked");
            return;
        }

        records.forEach(async (invoice) => {
            try {
                if (invoice.status === "succeeded") {
                    return;
                }
                const { status, paid } = await checkout({
                    id: invoice.id,
                    total_price: invoice.price,
                });

                console.log({ status, paid });

                if (paid) {
                    await knex("invoices")
                        .update({ status: status })
                        .where({ order_id: invoice.id });
                    return;
                }
            } catch (error) {
                console.log(error);
            }
        });

        console.log("All invoices are checked");
    } catch (error) {
        console.log(error);
    }
};

module.exports = checkInvoiceStatus;
