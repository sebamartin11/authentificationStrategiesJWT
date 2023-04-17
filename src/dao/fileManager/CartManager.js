const fs = require("fs/promises");
const { existsSync } = require("fs");

class CartManager {
  static lastCartId = 0;

  constructor(path) {
    this.path = path;
  }

  async getCarts() {
    if (existsSync(this.path)) {
      const dataCarts = await fs.readFile(this.path, "utf-8");
      const allCarts = JSON.parse(dataCarts);
      allCarts.forEach((cart) => {
        cart.id = Number(cart.id);
      });
      return allCarts;
    } else {
      return [];
    }
  }

  async saveCarts(allCarts) {
    await fs.writeFile(this.path, JSON.stringify(allCarts, null, "\t"));
  }

  async addCart() {
    const data = await this.getCarts();
    CartManager.lastCartId++;
    const newCart = {
      id: CartManager.lastCartId,
      products: [],
    };

    data.push(newCart);
    await this.saveCarts(data);

    return newCart;
  }

  async getCartById(id) {
    const allCarts = await this.getCarts();
    const cartById = allCarts.find((cart) => cart.id === id);
    if (cartById) {
      return cartById;
    } else {
      console.error("Not found");
    }
  }

  async addProductToCart(cid, pid, quantity) {
    const allCarts = await this.getCarts();
    const cartById = await this.getCartById(cid);

    const targetProduct = await cartById.products.find(
      (product) => product.product == pid
    );

    const updatedProduct = targetProduct
      ? {
          product: targetProduct.product,
          quantity: targetProduct.quantity + +quantity,
        }
      : { product: pid, quantity: +quantity };

    const targetCartFiltered = await cartById.products.filter(
      (id) => id.product !== pid
    );
    const updatedCart = {
      ...cartById,
      products: [...targetCartFiltered, updatedProduct],
    };
    const updatedList = allCarts.map((cart) => {
      if (cart.id === cid) {
        return updatedCart;
      } else {
        return cart;
      }
    });

    await this.saveCarts(updatedList);
    return `product id ${pid} update from id cart ${cartById.id} `;
  }

  async deleteProductFromCart(cid, pid) {
    const allCarts = await this.getCarts();
    const cartById = await this.getCartById(cid);

    const targetProduct = await cartById.products.find(
      (product) => product.product == pid
    );

    if (!targetProduct) {
      throw new Error("Product not found");
    } else {
      const filteredCart = await cartById.products.filter(
        (id) => id.product !== pid
      );
      const updatedCart = { ...cartById, products: [...filteredCart] };

      const updatedList = allCarts.map((cart) => {
        if (cart.id === cid) {
          return updatedCart;
        } else {
          return cart;
        }
      });

      await this.saveCarts(updatedList);
      return `product id ${pid} delete from id cart ${cartById.id} `;
    }
  }

  async deleteCart(id) {
    const AllCarts = await this.getCarts();
    const filteredById = AllCarts.filter((cart) => cart.id !== id);
    await this.saveCarts(filteredById);
    return filteredById;
  }
}

module.exports = CartManager;
