import _ from 'lodash';
import moment from 'moment';
import {verifyToken} from 'jseminck-be-communication-utils';

import * as Expense from './../models/Expense';

/**
 * Request expense data from the API.
 * Usage: /api/expenses?year=2015&month=12
 */
async function get (req, res) {
    validateGetParameters(req, res);

    try {
        const {first, last} = getFirstAndLastDays(req.query);
        const expenses = await Expense.findAllBetween({start: first, end: last});
        return res.send(expenses);
    } catch (err) {
        return res.status(500).send({'error': err});
    }
}

/**
 * Validate that the parameters "year" and "month" are on the query parameters, and return an
 * error if they are not.
 */
function validateGetParameters (req, res) {
    if (!hasMonthAndYearQueryParameters(req.query)) {
        return res.status(500).send({'error': 'Missing year and/or month query paramters.'});
    }
}

/**
 * Returns the first and last days of the given month + year.
 */
function getFirstAndLastDays ({year, month}) {
    // Add 12 hours to the last day is a hack to fix h:mm:ss related issues with psql...
    const first = toMoment(year, month).format("YYYY-MM-DD h:mm:ss");
    const last = toMoment(year, month).endOf('month').add(12, 'hours').format("YYYY-MM-DD h:mm:ss");
    return {first, last};
}

/**
 * Return a moment.js object for a given year and month.
 */
function toMoment (year, month) {
    return moment(`${year} ${month}`, 'YYYY MM');
}

/**
 * Validate if the query has month/year get parameters.
 */
function hasMonthAndYearQueryParameters ({month, year}) {
    return (month && year);
}


/**
 * Get spending per day for a given month. Includes days where no money was spent.
 */
async function getGrouped (req, res) {
    validateGetParameters(req, res);

    try {
        const {first, last} = getFirstAndLastDays(req.query);
        const expenses = await Expense.findAllBetween({start: first, end: last});
        return res.send(groupExpensesByDay(expenses));
    } catch (err) {
        return res.status(500).send({'error': err});
    }
}

/**
 * Create a map of all days for the month (1 to number of days) and the amount spent per day.
 */
function groupExpensesByDay (expenses) {
    let grouped = {};

    _.times(moment(expenses[0].purchaseDate).daysInMonth(), day => grouped[day + 1] = 0);
    expenses.forEach(expense => {
        grouped[moment(expense.purchasedate).date()] += expense.price;
    });

    return grouped;
}

/**
 * Get spending per category for a given month.
 */
async function getCategory (req, res) {
    validateGetParameters(req, res);

    try {
        const {first, last} = getFirstAndLastDays(req.query);
        const expenses = await Expense.findAllBetween({start: first, end: last});
        return res.send(groupExpensesByCategory(expenses));
    } catch (err) {
        return res.status(500).send({'error': err});
    }
}

/**
 * Create a map of all categories and the amount spent per category
 */
function groupExpensesByCategory (expenses) {
    var grouped = {};

    expenses.forEach(expense => {
        if (grouped[expense.category]) {
            grouped[expense.category] += expense.price;
        } else {
            grouped[expense.category] = expense.price;
        }
    });

    return grouped;
}

/**
 * Create a new expense.
 */
async function post (req, res) {
    try {
        let expense = Expense.create(req.body);
        return res.status(200).send(expense);
    } catch (err) {
        return res.status(500).send({'error': err});
    }
}

/**
 * Remove an existing expense.
 */
async function del (req, res) {
    try {
        let expense = await Expense.findOneById(req.params.id);
        await Expense.remove(req.params.id);
        res.status(200).send(expense);
    } catch (err) {
        res.status(500).send({'error': err});
    }
}

async function reset (req, res) {
  try {
      await Expense.__recreate;
      res.status(200).send({success: true});
  } catch (err) {
      res.status(500).send({'error': err});
  }
}

export default function configureExpenseRoutes (app) {
    app.all('/api/expenses*', async (req, res, next) => {
        var result = await verifyToken(req);

        if (process.env.NODE_ENV === 'TEST' || result.success) {
            next();
        }
        else {
            res.status(401).send({
                "error": result.message
            });
        }
    });

    app.route('/api/expenses')
        .get(get)
        .post(post);

    app.route('/api/expenses/grouped')
        .get(getGrouped);

    app.route('/api/expenses/category')
        .get(getCategory);

    app.route('/api/expenses/:id')
        .delete(del);

    //TODO: To be removed!
    app.route('/api/expenses/reset')
      .get(reset);
}

// Exporting for testing purposes only...
// export { get, getGrouped, getCategory, getMonthlyAllowance, post, del };
