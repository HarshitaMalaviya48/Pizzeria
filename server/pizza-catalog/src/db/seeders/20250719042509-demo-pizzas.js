"use strict";

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "PizzaCatalogs",
      [
        {
          pizzaname: "Margherita",
          ingredients: '["Tomato", "Mozzarella", "Basil"]',
          price: 199,
          discount_percent: 10,
          image_url: "/images/Margherita-Pizza.webp",
          category: "Veg",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          pizzaname: "Pepperoni",
          ingredients: '["Pepperoni", "Cheese", "Tomato Sauce"]',
          price: 349,
          discount_percent: 5,
          image_url: "/images/Pepperoni-pizza.png",
          category: "Non-Veg",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          pizzaname: "Veggie Supreme",
          ingredients: '["Capsicum", "Onion", "Tomato", "Mushroom", "Olives"]',
          price: 299,
          discount_percent: 0,
          image_url: "/images/veggie-pizza.png",
          category: "Veg",

          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          pizzaname: "BBQ Chicken",
          ingredients: '["Grilled Chicken", "BBQ Sauce", "Onion", "Cheese"]',
          price: 379,
          discount_percent: 0,
          image_url: "/images/bbq-chicken-pizza.jpg",
          category: "Non-Veg",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          pizzaname: "Paneer Tikka",
          ingredients: '["Paneer", "Onion", "Capsicum", "Tikka Sauce"]',
          price: 319,
          discount_percent: 5,
          image_url: "/images/paneer-tikka.jpg",
          category: "Veg",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          pizzaname: "Meat Lovers",
          ingredients: '["Pepperoni", "Sausage", "Ham", "Bacon", "Cheese"]',
          price: 399,
          discount_percent: 0,
          image_url: "/images/meat-lovers.png",
          category: "Non-Veg",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          pizzaname: "Cheese Burst",
          ingredients: '["Mozzarella", "Cheddar", "Parmesan", "Tomato Sauce"]',
          price: 259,
          discount_percent: 0,
          image_url: "/images/cheese-burst.jpeg",
          category: "Veg",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          pizzaname: "Chicken Sausage",
          ingredients: '["Chicken Sausage", "Onion", "Cheese", "Tomato Sauce"]',
          price: 329,
          discount_percent: 0,
          image_url: "/images/chicken-sausage.jpeg",
          category: "Non-Veg",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          pizzaname: "Farmhouse",
          ingredients: '["Tomato", "Onion", "Capsicum", "Corn", "Cheese"]',
          price: 279,
          discount_percent: 5,
          image_url: "/images/farmhouse-pizza.jpg",
          category: "Veg",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          pizzaname: "Spicy Chicken Mexicana",
          ingredients: '["Spicy Chicken", "Jalapenos", "Cheese", "Onion"]',
          price: 369,
          discount_percent: 15,
          image_url: "/images/chicken-maxican.jpg",
          category: "Non-Veg",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("PizzaCatalogs", null, {});
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
