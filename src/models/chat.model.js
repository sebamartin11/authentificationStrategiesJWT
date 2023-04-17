const mongoose = require("mongoose");

const messagesCollection = "messages";

const messagesSchema = new mongoose.Schema({
  user: {
    type: String,
    require: true,
  },
  message: {
    type: String,
    require: true,
  },
});

module.exports = {
  messagesModel: mongoose.model(messagesCollection, messagesSchema),
};
