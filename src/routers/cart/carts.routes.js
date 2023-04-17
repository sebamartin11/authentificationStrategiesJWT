const { Router } = require("express");

const {options} = require("../../config/options");

const router = Router();

//MONGODB

const CartMongoManager = require("../../dao/mongoManager/cartManager.mongoose");
const ecommerceCarts = new CartMongoManager();

const ProductMongoManager = require("../../dao/mongoManager/productManager.mongoose");
const ecommerce = new ProductMongoManager(options.mongoDb.url);


// Routes

//CREATE cart
router.post("", async (req, res) => {
  try {
    let newCart = await ecommerceCarts.addCart();
    res.send({ status: "success", message: newCart });
  } catch (error) {
    res.status(500).send({
      status: "error",
      error: error.message,
    });
  }
});

//GET all carts
router.get("", async (req, res) => {
  try {
    let carts = await ecommerceCarts.getCarts();
    const cartLimit = req.query.limit;

    let integerCartLimit;

    if (cartLimit) {
      integerCartLimit = parseInt(cartLimit);
      if (isNaN(integerCartLimit)) {
        return res.status(400).send({
          status: "error",
          error: "cartLimit must be a valid number",
        });
      }
      if (integerCartLimit <= 0 || integerCartLimit > carts.length) {
        return res
          .status(404)
          .send({ status: "error", error: "Carts not found" });
      }
    }

    if (integerCartLimit) carts = carts.slice(0, integerCartLimit);

    res.send({ status: "success", payload: carts });
  } catch (error) {
    res.status(500).send({
      status: "error",
      error: error.message,
    });
  }
});

//GET cart by id

router.get("/:cid", async (req, res) => {
  try {
    const cid = req.params.cid;

    const cartById = await ecommerceCarts.getCartById(cid);

    if (!cartById) {
      return res.status(404).send({ status: "error", error: error.message });
    }

    res.send({ status: "success", payload: cartById });
  } catch (error) {
    res.status(500).send({
      status: "error",
      error: error.message,
    });
  }
});


//POST new product to cart

router.post("/:cid/products/:pid", async (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;
  const quantity = +req.query.quantity;

  try {
    const productExist= await ecommerce.getProductById(pid)
    
    if(productExist){
    let defaultQuantity;

    if (!quantity) {
      defaultQuantity = 1;
    } else {
      defaultQuantity = quantity;
    }

    const addProduct = await ecommerceCarts.updateCartProduct(
      cid,
      pid,
      defaultQuantity
    );
    res.send({ status: "success", message: addProduct });
  }
  } catch (error) {
    res.status(500).send({
      status: "error",
      error: error.message,
    });
  }
});

//PUT update all products. Product list

router.put("/:cid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const newProducts = req.body;

    const updatedCart = await ecommerceCarts.updatePropertiesProducts(
      cid,
      newProducts
    );
    res.send({
      status: "success",
      payload: updatedCart,
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      error: error.message,
    });
  }
});

//PUT update only the quantity of a product

router.put("/:cid/products/:pid", async (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;
  const quantity = +req.body.quantity;
  try {
    if (!quantity) {
      throw new Error("an amount of product must be provided");
    }
    const updateProduct = await ecommerceCarts.updateCartProduct(
      cid,
      pid,
      quantity
    );
    res.send({
      status: "success",
      payload: updateProduct,
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      error: error.message,
    });
  }
});

//DELETE product from cart

router.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const deleteProduct = await ecommerceCarts.deleteProductFromCart(cid, pid);
    res.send({ status: "success", message: deleteProduct });
  } catch (error) {
    res.status(500).send({
      status: "error",
      error: error.message,
    });
  }
});

//DELETE cart by id. Empty cart
router.delete("/:cid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const cartDelete = await ecommerceCarts.deleteCart(cid);
    res.send({ status: "success", message: cartDelete });
  } catch (error) {
    res.status(500).send({
      status: "error",
      error: error.message,
    });
  }
});

module.exports = router;

//FILESYSTEM

// const CartManager = require("../../dao/fileManager/CartManager");

// const ecommerceCarts = new CartManager(options.FileSystem.carts);

// // Routes

// //CREATE cart
// router.post("", async (req, res) => {
//   let newCart = await ecommerceCarts.addCart();
//   res.send({ status: "success", message: newCart });
// });

// //GET all carts
// router.get("", async (req, res) => {
//   let carts = await ecommerceCarts.getCarts();
//   const cartLimit = req.query.limit;

//   let integerCartLimit;

//   if (cartLimit) {
//     integerCartLimit = parseInt(cartLimit);
//     if (isNaN(integerCartLimit)) {
//       return res.status(400).send({
//         status: "error",
//         error: "cartLimit must be a valid number",
//       });
//     }
//     if (integerCartLimit <= 0 || integerCartLimit > carts.length) {
//       return res
//         .status(404)
//         .send({ status: "error", error: "Carts not found" });
//     }
//   }

//   if (integerCartLimit) carts = carts.slice(0, integerCartLimit);

//   res.send({ status: "success", payload: carts });
// });

// //GET cart by id

// router.get("/:cid", async (req, res) => {
//   const cartId = req.params.cid;

//   if (isNaN(cartId)) {
//     return res
//       .status(400)
//       .send({ status: "error", error: "cartId must be a valid number" });
//   }

//   const integerCartId = parseInt(cartId);

//   if (integerCartId <= 0) {
//     res.status(404).send({ status: "error", error: "Cart not found" });
//   }

//   const cartById = await ecommerceCarts.getCartById(integerCartId);

//   if (!cartById) {
//     return res.status(404).send({ status: "error", error: "Cart not found" });
//   }

//   res.send({ status: "success", payload: cartById });
// });

// //POST new product to cart

// router.post("/:cid/products/:pid", async (req, res) => {
//   const cid = +req.params.cid;
//   const pid = +req.params.pid;
//   const quantity = +req.query.q;

//   let defaultQuantity;

//   if (!quantity) {
//     defaultQuantity = 1;
//   } else {
//     defaultQuantity = quantity;
//   }

//   let addProduct = await ecommerceCarts.addProductToCart(cid, pid, defaultQuantity);
//   res.send({ status: "success", message: addProduct });
// });

// //DELETE product from cart

// router.delete("/:cid/products/:pid", async (req, res) => {
//   const cid = +req.params.cid;
//   const pid = +req.params.pid;
//   const deleteProduct = await ecommerceCarts.deleteProductFromCart(cid, pid);
//   res.send({ status: "success", message: deleteProduct });
// });

// //DELETE cart by id
// router.delete("/:pid", async (req, res) => {
//   const pid = +req.params.pid;
//   const cartDelete = await ecommerceCarts.deleteCart(pid);
//   res.send({ status: "success", message: cartDelete });
// });

// module.exports = router;
