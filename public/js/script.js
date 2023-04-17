// Socket Client side
// Socket server connection --> connection event
const socket = io();

//DOM elements
const form = document.getElementById("newProductForm");
const productListContainer = document.getElementById("product-list-container");

//Socket Emitters

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const requestOptions = {
    method: "POST",
    body: formData,
    redirect: "manual",
  };

  fetch("http://localhost:8080/", requestOptions); //Send formData object within the body request, to be received in req.body from newProduct function

  form.reset();
});

//Socket listeners

socket.on("newProduct", (data) => {
  const newProductDiv = document.createElement("div");
  newProductDiv.innerHTML = `<div id="pid" value="${data._id}" class="card card-product" style="width: 18rem;">
            <img
              class="card-img-top"
              src="/static/img/${data.thumbnail}"
              alt="${data.title}"
            />
            <div class="card-body">
              <h3 class="card-title">${data.title}</h3>
              <h5 class="card-title">$${data.price}</h5>
              <p class="card-text">${data.description}</p>
              <h5 class="card-text">Stock: ${data.stock}</h5>
            </div>
          </div>`;

  productListContainer.append(newProductDiv);

  window.location.reload();
});

//add product to cart button

function addToCart(pid) {

  let currentCart = "63e281e5d43e02a3f30af2da";

  if (!currentCart) {
    fetch("http://localhost:8080/api/carts/", { method: "POST" })
      .then((response) => response.json())
      .then((data) => (currentCart = data._id));
  }

  fetch(`http://localhost:8080/api/carts/${currentCart}/products/${pid}`, { method: "POST" })
    .then(alert("Product added to cart"))
    
}
