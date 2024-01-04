"use strict";

const request = require("supertest");
const app = require("./app");
let db = require("./fakeDb");

let testItem1 = { name: "popsicle", price: 1.45 };
let testItem2 = { name: "cheerios", price: 3.40 };

beforeEach(function () {
  db.items.push(testItem1, testItem2);
});

afterEach(function () {
  db.items = [];
});

/** GET /items - returns `{items: [{name: ... price:...}, ...]}` */

describe("GET /items", function () {
  test("get all items", async function () {
    const resp = await request(app).get("/items");

    expect(resp.body).toEqual(
      {
        items: [
          { name: "popsicle", price: 1.45 },
          { name: "cheerios", price: 3.40 }
        ]
      });
  });
});


/** POST /items - creates item from data;
 * returns `{added: {name: ... price:...}`
 * */

describe("POST /items", function () {
  test("add a new item", async function () {
    const resp = await request(app)
      .post("/items")
      .send({
        name: "chips",
        price: 2.99
      });
      //FIXME:200 vs 201 code
      expect(resp.statusCode).toEqual(201);
      expect(resp.body).toEqual({
        added: {name: "chips", price: 2.99}
      })
      expect(db.items.length).toEqual(3);
  });
});


/** GET /items/[name] - return data about one item
 * `{name: ... price:...}`
 * */

describe("GET /items/:name", function () {
  test("get a single item", async function () {
    const resp = await request(app).get(`/items/${testItem1.name}`);

    expect(resp.body).toEqual({ name: "popsicle", price: 1.45 });
  });

  test("Responds with 404 if name invalid", async function() {
    const resp = await request(app).get(`/items/not-here`);
    expect(resp.statusCode).toEqual(404);
  });
});


/** PATCH /items/[name] - update item; return {updated: `{name: ... price:...}}`
 * */

describe("PATCH /items", function () {
  test("Updates a single item", async function () {
    const newItemName = "new_popsicle";
    const newItemPrice = 2.99;

    const resp = await request(app)
      .patch(`/items/${testItem1.name}`)
      .send({
        name: newItemName,
        price: newItemPrice
      });
      //FIXME: Same Error (200 vs 201)
      expect(resp.statusCode).toEqual(201);
      expect(resp.body).toEqual({
        updated: {name: newItemName, price: newItemPrice}
      })
      expect(resp.body).not.toEqual({
        updated: {name: testItem1.name, price: testItem1.price}
      })
      expect(db.items.length).toEqual(2);
  });

  test("Responds with 404 if name invalid", async function() {
    const resp = await request(app).patch(`/items/not-here`);
    expect(resp.statusCode).toEqual(404);
  });
});

/** DELETE /items/[name] - delete item,
 *  return `{message: "Deleted"}` */

describe("DELETE /items/:name", function() {
  test("Deletes a single item", async function() {
    const resp = await request(app)
      .delete(`/items/${testItem1.name}`);
    expect(resp.body).toEqual({ message: "Deleted" });
    expect(db.items.length).toEqual(1);
    expect(db.items.length).not.toEqual(2);
  });

  test("Responds with 404 if name invalid", async function() {
    const resp = await request(app).delete(`/items/not-here`);
    expect(resp.statusCode).toEqual(404);
  });

});