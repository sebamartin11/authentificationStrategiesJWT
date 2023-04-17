const { messagesModel } = require("../../models/chat.model.js");

class ChatMongoManager {
  async getMessages() {
    try {
      const listMessages = await messagesModel.find().lean();
      return listMessages;
    } catch (error) {
      throw new Error(`Couldn't read file ${error}`);
    }
  }

  async addMessages(msg) {
    try {
      const newMsg = await messagesModel.create(msg);
      return newMsg;
    } catch (error) {
      throw new Error(`Error saving: ${error}`);
    }
  }
}

module.exports = ChatMongoManager;
