// js/product.js
const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

let products = JSON.parse(localStorage.getItem("products")) || [];

if (products.length === 0) {
  fetch("data/products.json")
    .then(res => res.json())
    .then(data => {
      products = data;
      showProduct();
    })
    .catch(err => console.error("Error loading product data:", err));
} else {
  showProduct();
}

function showProduct() {
  const product = products.find(p => p.id === productId);

  if (!product) {
    document.querySelector(".product-detail-container").innerHTML =
      `<p style="text-align:center;color:#777;">Product not found.</p>`;
    return;
  }

  document.getElementById("product-image").src = product.image;
  document.getElementById("product-name").textContent = product.name;
  document.getElementById("product-price").textContent = "GHS " + product.price.toFixed(2);
  document.getElementById("product-description").textContent = product.description;

  const message = `Hi! I'm interested in the ${product.name} listed on Spotless Mart.`;
  document.getElementById("whatsapp-btn").href =
    `https://wa.me/233551836194?text=${encodeURIComponent(message)}`;
}
