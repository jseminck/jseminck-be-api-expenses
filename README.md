# jseminck-be-api-expenses

[![Build Status](https://travis-ci.org/jseminck/jseminck-be-api-expenses.svg?branch=master)](https://travis-ci.org/jseminck/jseminck-be-api-expenses)  [![Coverage Status](https://coveralls.io/repos/github/jseminck/jseminck-be-api-expenses/badge.svg?branch=master)](https://coveralls.io/github/jseminck/jseminck-be-api-expenses?branch=master)   [![Dependency Status](https://david-dm.org/jseminck/jseminck-be-api-expenses.svg)](https://david-dm.org/jseminck/jseminck-be-api-expenses)   [![Code Climate](https://codeclimate.com/github/jseminck/jseminck-be-api-expenses/badges/gpa.svg)](https://codeclimate.com/github/jseminck/jseminck-be-api-expenses)

API for managing expenses

## API

Sending a GET request to any endpoint without the correct query parameters will return the following response:
```js
{
"error": "Missing year and/or month query paramters."
}
```

### GET /api/expenses
It is required to provide ?year=YYYY&month=MM in the GET url. Returns a list of expenses for that year/month combination.
```js
[
  {
    "id": 2500,
    "purchase_date": "2016-05-29T12:00:00.000Z",
    "category": "Transport",
    "price": 1.52,
    "description": "Parking",
    "created_at": "2016-07-03T19:03:55.369Z"
  },
  {
    "id": 2510,
    "purchase_date": "2016-05-01T12:00:00.000Z",
    "category": "Groceries",
    "price": 40,
    "description": "Maxima",
    "created_at": "2016-07-03T19:03:55.952Z"
  }
]
```

### POST /api/expenses
Create a new expense in the database. Requires a body in the form of:
```js
{
    "description": "My Description",
    "category": "My Category",
    "purchase_date": "YYYY-MM-DD h:mm:ss",
    "price": 123.45
}
```

Currently returns database information. This return data is useless. To be updated.

### DEL /api/expenses/:id
Deletes the expense from the database, Returns a list containing the deleted expense:
```js
[
  {
    "id": 2908,
    "purchase_date": "2016-06-28T12:00:00.000Z",
    "category": "Work Lunch",
    "price": 5,
    "description": "Rataskaevu 16",
    "created_at": "2016-07-04T05:14:06.009Z"
  }
]
```

### GET /api/expenses/grouped
Returns an object containing the days of the month as keys and the amount spent for that given day as value:
```js
{
  "1": 164.7,
  "2": 121,
  "3": 15.9,
  "4": 32.6,
  "5": 5.4,
  "6": 16.04,
  "7": 0,
  "8": 185,
  "9": 3,
  "10": 23,
  "11": 8,
  "12": 12,
  "13": 144.96,
  "14": 188.45,
  "15": 0,
  "16": 0,
  "17": 0,
  "18": 38.4,
  "19": 7.8,
  "20": 10.4,
  "21": 21,
  "22": 72,
  "23": 12,
  "24": 0,
  "25": 210,
  "26": 0,
  "27": 85,
  "28": 30.4,
  "29": 51.519999999999996,
  "30": 3,
  "31": 18.35
}
```

### GET /api/expenses/category
Returns an object containing the category names as keys and the amount spent for that category as value:
```js
{
  "Transport": 19.52,
  "Groceries": 217.73999999999998,
  "Entertainment": 292.8,
  "Medical": 10,
  "pets": 71.1,
  "Utilities": 215.86,
  "Home": 266,
  "Presents": 61,
  "Work Lunch": 43.8,
  "Sports": 41.6,
  "Internet": 31,
  "Eating Out": 84.5,
  "Travel": 100,
  "Gas": 25
}
```

### Incorrect token
In case of incorrect token you will receive:
```js
{
"error": "Incorrect key"
}
```

