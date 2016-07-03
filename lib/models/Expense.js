import {PGModel} from 'jseminck-be-pg';

const ExpenseModel = new PGModel({
    tableName: "expenses",
    columns: [
        {name: "id", type: "serial"},
        {name: "purchase_date", type: "timestamp"},
        {name: "category", type: "varchar(128)"},
        {name: "price", type: "numeric"},
        {name: "description", type: "varchar(256)"},
        {name: "created_at", type: "timestamp", default: "CURRENT_TIMESTAMP"}
    ],
    debug: false
});

/**
 * Find all expenses between two given dates
 *
 * @param {Object} search
 *   @param {String} search.start
 *   @param {String} search.end
 * @returns {Object[]} all found expenses (can be none)
 */
export async function findAllBetween({start, end}) {
    return await ExpenseModel.findAll({column: "purchase_date", value: {between: {start, end}}});
}

/**
 * Find all expenses between two given dates
 *
 * @param {Number} id
 * @returns {Object] The unique expense
 */
export async function findOneById(id) {
    return await ExpenseModel.findAll({column: "id", value: id});
}

/**
 * Create a new expense.
 *
 * @param {Object} expense
 *   @param {Date} expense.purchaseDate
 *   @param {String} expense.category
 *   @param {Number} expense.price
 *   @param {String} expense.description
 */
export async function create(expense) {
    return await ExpenseModel.create(expense);
}

/**
 * Remove an expense from the database by id.
 *
 * @param {Object} expense
 *   @param {Number} expense.id
 */
export async function remove(id) {
    return await ExpenseModel.remove({column: "id", value: id});
}

/**
 * Drop and recreate the expenses table. This will remove all data!
 */
export async function __recreate() {
    return await ExpenseModel.__recreate();
}