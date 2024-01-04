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

describe("POST /items", function () {
  test("add a new item", async function () {
    const resp = await request(app)
      .post("/items")
      .send({
        name: "chips",
        price: 2.99
      });
      expect(resp.body).toEqual({
        added: {name: "chips", price: 2.99}
      })
      expect(db.items.length).toEqual(3)
  });
});