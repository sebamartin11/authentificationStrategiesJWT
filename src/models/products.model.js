const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const productsCollection = "product";

const productsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
  },
  price: {
    type: Number,
    required: true,
  },
  thumbnail: {
    type: String,
    //in case the multer function change to many files the type should be type: [String]
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    //enum: ["category1","category2","category3"] 
    //The value of category can be only one of these options
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
});


productsSchema.plugin(mongoosePaginate);

module.exports = {
  productsModel: mongoose.model(productsCollection, productsSchema),
  productsCollection,
};
