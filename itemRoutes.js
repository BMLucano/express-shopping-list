"use strict";

const express = require("express");

const db = require("./fakeDb");
const { BadRequestError } = require("./expressError");
const router = new express.Router();

/**GET /items: returns list of shopping items */
router.get("/", function(req, res){
  const items = db.items;
  // console.log("items=", items)
  return res.json({ items });
})

/** POST /items: accept JSON body, add item, and return it */
router.post("/", function(req, res){
  if(req.body === undefined) throw new BadRequestError();

  const newItem = {name: req.body.name, price: req.body.price};
  db.items.push(newItem);
  console.log("newItems", newItem)
  return res.json({added: newItem})

})




module.exports = router;