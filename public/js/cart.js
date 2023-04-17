// delete product from cart button

function removeFromCart(pid) {

    let currentCart = "63e281e5d43e02a3f30af2da";

    fetch(`http://localhost:8080/api/carts/${currentCart}/products/${pid}`, { method: "DELETE" })
      .then(alert("Product deleted from cart"))
      
  }