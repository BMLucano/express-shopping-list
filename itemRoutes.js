"use strict";

const express = require("express");

const db = require("./fakeDb");
const { BadRequestError } = require("./expressError");
const router = new express.Router();

/** GET /items: returns list of shopping items */
router.get("/", function(req, res){
  const items = db.items;

  console.log("GET request reached: items=", items);

  return res.json({ items });
});

/** POST /items: accept JSON body, add item, and return it */
router.post("/", function(req, res){
  if(req.body === undefined) throw new BadRequestError();

  const newItem = {name: req.body.name, price: req.body.price};
  db.items.push(newItem);

  console.log("POST request reached: new item=", newItem);

  return res.json({added: newItem});

});

/** GET /items/:name: return single item: */

router.get("/:name", function (req, res){
  const itemName = req.params.name;

  console.log (`GET request for ${itemName} reached`);

  let item;

  for (let i of db.items){
    if (i.name === itemName){
      item = i;
    };
  };

  return res.json(item);
});

/** PATCH /items/:name: accept JSON body, modify item, return it: */

router.patch("/:name", function (req, res){
  const itemName = req.params.name;

  console.log (`PATCH request for ${itemName} reached`);

  let updatedItem;

  for (let i of db.items){
    if (i.name === itemName){
      i.name = req.body.name;
      i.price = req.body.price;
      updatedItem = i;
    };
  };

  console.log (`PATCH request completed: ${itemName} is now ${updatedItem}`);

  return res.json({updated: updatedItem});
});


/** DELETE /items/:name: delete item: */

router.delete("/:name", function (req, res){
  const itemName = req.params.name;

  console.log (`DELETE request for ${itemName} reached`);

  console.log("Current items list =", db.items);

  // Loops over db.items, finds the desired item obj within the list and
  // removes desired item from the items list
  for (let i = 0; i < db.items.length; i++) {
    if (db.items[i].name === itemName){
      db.items.splice(i, 1);
    };
  };

  console.log("New items list =", db.items);


  return res.json({message: "Deleted"});
});

module.exports = router;