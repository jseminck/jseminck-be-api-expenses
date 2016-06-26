import supertest from 'supertest';
import moment from 'moment';
import async from 'async';
import * as Expense from './../../lib/models/Expense';

const app = require('./../../lib/index');

describe('Integration tests for /api/expenses', () => {
    function createExpense (date, price, description) {
        return {
            description: description,
            category: description,
            purchaseDate: moment(date).format("YYYY-MM-DD h:mm:ss"),
            price: price
        };
    }

    describe("GET with valid token", () => {
        beforeEach(async function(done) {
            await Expense.__recreate();

            async.series([
                (cb) => supertest(app).post(`/api/expenses`).send(createExpense("2015-10-01", 10, "cat1")).expect(200).end(cb),
                (cb) => supertest(app).post(`/api/expenses`).send(createExpense("2015-10-15", 20, "cat2")).expect(200).end(cb),
                (cb) => supertest(app).post(`/api/expenses`).send(createExpense("2015-10-15", 90, "cat2")).expect(200).end(cb),
                (cb) => supertest(app).post(`/api/expenses`).send(createExpense("2015-10-31", 30, "cat3")).expect(200).end(cb),
                (cb) => supertest(app).post(`/api/expenses`).send(createExpense("2015-09-30", 40, "cat4")).expect(200).end(cb),
                (cb) => supertest(app).post(`/api/expenses`).send(createExpense("2015-11-01", 50, "cat5")).expect(200).end(cb)
            ], done);
        });

        it("returns 1 item for september", function(done) {
            supertest(app)
                .get(`/api/expenses?year=2015&month=9`)
                .expect((res) => {
                    expect(res.body.length).to.equal(1);
                })
                .end(done);
        });

        it("returns 4 items for october", function(done) {
            supertest(app)
                .get(`/api/expenses?year=2015&month=10`)
                .expect((res) => {
                    expect(res.body.length).to.equal(4);
                })
                .end(done);
        });

        it("returns 1 item for november", function(done) {
            supertest(app)
                .get(`/api/expenses?year=2015&month=11`)
                .expect((res) => {
                    expect(res.body.length).to.equal(1);
                })
                .end(done);
        });

        it("returns grouped data for september", function(done) {
            supertest(app)
                .get(`/api/expenses/grouped?year=2015&month=9`)
                .expect((res) => {
                    for (var day = 1; day <= 30; day ++) {
                        let expectedAmount = 0;

                        if (day === 30) {
                            expectedAmount = 40;
                        }

                        expect(res.body[day]).to.equal(expectedAmount);
                    }
                })
                .end(done);
        });

        it("returns grouped data for october", function(done) {
            supertest(app)
                .get(`/api/expenses/grouped?year=2015&month=10`)
                .expect((res) => {
                    for (var day = 1; day <= 30; day ++) {
                        let expectedAmount = 0;

                        if (day === 1) {
                            expectedAmount = 10;
                        }
                        if (day === 15) {
                            expectedAmount = 110;
                        }
                        if (day === 31) {
                            expectedAmount = 40;
                        }

                        expect(res.body[day]).to.equal(expectedAmount);
                    }
                })
                .end(done);
        });

        it("returns category data for october", function(done) {
            supertest(app)
                .get(`/api/expenses/category?year=2015&month=10`)
                .expect((res) => {
                    expect(res.body["cat1"]).to.equal(10);
                    expect(res.body["cat2"]).to.equal(110);
                    expect(res.body["cat3"]).to.equal(30);
                })
                .end(done);
        });

        it("returns grouped data for november", function(done) {
            supertest(app)
                .get(`/api/expenses/grouped?year=2015&month=11`)
                .expect((res) => {
                    for (var day = 1; day <= 30; day++) {
                        let expectedAmount = 0;

                        if (day === 1) {
                            expectedAmount = 50;
                        }

                        expect(res.body[day]).to.equal(expectedAmount);
                    }
                })
                .end(done);
        });

        it("allows POST and has 5 items for November", function(done) {
            const expense = {
                "description": "new",
                "category": "new",
                "purchaseDate": new Date("2015-10-03"),
                "price": "123"
            };

            async.series([
                (cb) => supertest(app)
                    .post('/api/expenses')
                    .send(expense)
                    .expect(200)
                    .end(cb),
                (cb) => supertest(app)
                        .get(`/api/expenses?year=2015&month=10`).expect((res) => {
                            expect(res.body.length).to.equal(5);
                        }).end(cb)
            ], done);
        });

        it("allows DELETE and has 3 items for November", function(done) {
            let expenseId;

            async.series([
                (cb) => supertest(app)
                    .get(`/api/expenses?year=2015&month=10`).expect((res) => {
                        expect(res.body.length).to.equal(4);
                        expenseId = res.body[0].id;
                    }).end(cb),
                (cb) => supertest(app)
                    .del('/api/expenses/' + expenseId)
                    .expect(200)
                    .end(cb),
                (cb) => supertest(app)
                    .get(`/api/expenses?year=2015&month=10`).expect((res) => {
                        expect(res.body.length).to.equal(3);
                    }).end(cb)
            ], done);
        });
    });

    // describe("without key", () => {
    //     beforeEach(function() {
    //         this.noKey = {
    //             success: false,
    //             message: "Please provide a key"
    //         };
    //     });
    //
    //     it("returns error for GET /api/expenses", function(done) {
    //         supertest(app)
    //             .get('/api/expenses?year=2015&month=11')
    //             .expect(401, this.noKey, done);
    //     });
    //
    //     it("returns error for GET /api/expenses/allowance", function(done) {
    //         supertest(app)
    //             .get('/api/expenses/grouped?year=2015&month=11')
    //             .expect(401, this.noKey, done);
    //     });
    //
    //     it("returns error for GET /api/expenses/grouped", function(done) {
    //         supertest(app)
    //             .get('/api/expenses/grouped?year=2015&month=11')
    //             .expect(401, this.noKey, done);
    //     });
    //
    //     it("returns error for GET /api/expenses/category", function(done) {
    //         supertest(app)
    //             .get('/api/expenses/grouped?year=2015&month=11')
    //             .expect(401, this.noKey, done);
    //     });
    //
    //     it("returns error for POST /api/expenses", function(done) {
    //         supertest(app)
    //             .post('/api/expenses')
    //             .expect(401, this.noKey, done);
    //     });
    //
    //     it("returns error for DELETE /api/expenses", function(done) {
    //         supertest(app)
    //             .del('/api/expenses')
    //             .expect(401, this.noKey, done);
    //     });
    // });
    //
    // describe("GET without month and year parameters", () => {
    //     const token = getToken();
    //     it("returns error for expenses", function(done) {
    //         supertest(app)
    //             .get(`/api/expenses?key=${token}`)
    //             .expect(500, {
    //                 'error': 'Missing year and/or month query paramters.'
    //             }, done);
    //     });
    // });
});
