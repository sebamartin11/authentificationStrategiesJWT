const mongoose = require("mongoose");
const { productsCollection } = require("./products.model");


const cartsCollection = "Cart";

const cartsSchema = new mongoose.Schema({
  products: {
    type: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: productsCollection,
        },
        amount: {
          type: Number,
        },
      },
    ],
    default: [],
  },
});



module.exports = {
  cartsModel: mongoose.model(cartsCollection, cartsSchema),
  cartsCollection,
};
