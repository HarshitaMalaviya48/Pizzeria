const express = require("express");
const router = express.Router();

const db = require("./db/models/index.js");
const PizzaCatalog = db.PizzaCatalog;

router.get("/get-all", async (req, res, next) => {
  try {
    const pizzas = await PizzaCatalog.findAll();
    const pizzasWithUpdatedImageUrl = pizzas.map((pizza) => {
      const pizzaObj = pizza.toJSON();

      return {
        ...pizzaObj,
        image_url: `http://localhost:3001${pizzaObj.image_url}`,
      };
    });
    return res
      .status(200)
      .json({ error: false, success: true, pizzas: pizzasWithUpdatedImageUrl });
  } catch (err) {
    console.log("err in fetching pizza", err);
    return res.status(500).json({
      error: true,
      success: false,
      message: "Error while fetching pizzas",
    });
  }
});

router.get("/get/:id", async (req, res) => {
  try {
    const pizzaId = req.params.id;
    const pizza = await PizzaCatalog.findOne({
      where: { id: pizzaId },
    });

    if (!pizza) {
      return res
        .status(404)
        .json({ error: true, success: false, message: "pizza not found" });
    }

    console.log("in pizza service ", pizza);
     const pizzaObj = pizza.toJSON();
    
    const pizzaWithUpdatedImageUrl = {
      ...pizzaObj,
      image_url: `http://localhost:3001${pizzaObj.image_url}`,
    };

    return res
      .status(200)
      .json({ error: false, success: true, pizza: pizzaWithUpdatedImageUrl });
  } catch (error) {
    console.log("err in fetching pizza", err);
    return res.status(500).json({
      error: true,
      success: false,
      message: "Error while fetching pizzas",
    });
  }
});

module.exports = router;
