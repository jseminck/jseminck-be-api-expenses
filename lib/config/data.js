import expenses from './../../data/expenses.json';
import * as Expense from './../models/Expense';

export default async function configureData() {
    return new Promise(async (resolve, reject) => {
        if (process.env.NODE_ENV === "DEVELOPMENT") {
            try {
                await Expense.__recreate();
                expenses.forEach(async (expense) => await Expense.create(expense));

                console.log("Data has been initialized"); // eslint-disable-line no-console
            }
            catch (err) {
                console.log("Error while initializing data; ", err); // eslint-disable-line no-console
                reject(err);
            }

            resolve();
        }
        else {
            resolve();
        }
    });
}