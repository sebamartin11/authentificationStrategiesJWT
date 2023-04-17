//Ways to connect to different systems

const options = {
  // FileSystem: {
  //   products: "./fileSystemDb/productsDataBase.json",
  //   carts: "./fileSystemDb/cartDataBase.json",
  // },
  mongoDb: {
    url: "mongodb+srv://admin:Data1471@ecommercebackend0.voob3od.mongodb.net/ecommerceBackend0?retryWrites=true&w=majority",
  },
};

module.exports = {options};
