// ==============================
// Homepage Script (FINAL FIXED)
// ==============================

// DOM Elements
const productList = document.getElementById("product-grid");
const hotDealsGrid = document.getElementById("hot-deals-grid");
const searchInput = document.getElementById("search-input");
const categoryFilter = document.getElementById("category-filter");

let products = JSON.parse(localStorage.getItem("products")) || [];

// ==============================
// Load Products
// ==============================
if (products.length === 0) {
  fetch("data/products.json")
    .then(res => res.json())
    .then(data => {
      // Assign unique IDs if missing
      products = data.map(p => ({
        ...p,
        id: p.id || Date.now().toString() + Math.random().toString(36).substr(2, 9)
      }));

      localStorage.setItem("products", JSON.stringify(products));
      displayProducts(products);
      displayHotDeals();
    })
    .catch(err => console.error("Error loading product data:", err));
} else {
  displayProducts(products);
  displayHotDeals();
}

// ==============================
// Display All Products
// ==============================
function displayProducts(productArray) {
  if (!productList) return;

  productList.innerHTML = "";

  if (productArray.length === 0) {
    productList.innerHTML = `<p style="grid-column:1/-1;text-align:center;color:#777;">No products found.</p>`;
    return;
  }

  const formatter = new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
    minimumFractionDigits: 2,
  });

  productArray.forEach((product) => {
    const formattedPrice = formatter.format(product.price);
    const formattedOldPrice = product.oldPrice ? formatter.format(product.oldPrice) : "";

    const productHTML = `
      <div class="product-card">
        <div class="product-image-wrapper">
          <img src="${product.image}" alt="${product.name}" class="product-img">
        </div>
        <div class="product-info">
          <h3 class="product-title">${product.name}</h3>
          <div class="product-price">
            <span class="current-price">${formattedPrice}</span>
            ${formattedOldPrice ? `<span class="old-price">${formattedOldPrice}</span>` : ""}
          </div>
          <a href="product.html?id=${product.id}" class="details-btn">View Details</a>
        </div>
      </div>
    `;
    productList.innerHTML += productHTML;
  });
}

// ==============================
// Display Hot Deals
// ==============================
function displayHotDeals() {
  if (!hotDealsGrid) return;

  const allProducts = JSON.parse(localStorage.getItem("products")) || [];
  const formatter = new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
    minimumFractionDigits: 2,
  });

  const hotDeals = allProducts.filter(p => {
    if (!p.oldPrice || p.oldPrice <= 0) return false;
    const discount = ((p.oldPrice - p.price) / p.oldPrice) * 100;
    return discount >= 20;
  });

  if (hotDeals.length === 0) {
    hotDealsGrid.innerHTML = `<p style="grid-column:1/-1;text-align:center;color:#777;">No hot deals right now 🔥</p>`;
    return;
  }

  hotDealsGrid.innerHTML = "";
  hotDeals.forEach((product) => {
    const formattedPrice = formatter.format(product.price);
    const formattedOldPrice = formatter.format(product.oldPrice);

    const productHTML = `
      <div class="product-card hot-deal">
        <div class="product-image-wrapper">
          <span class="hot-badge">🔥 Hot</span>
          <img src="${product.image}" alt="${product.name}" class="product-img">
        </div>
        <div class="product-info">
          <h3 class="product-title">${product.name}</h3>
          <div class="product-price">
            <span class="current-price">${formattedPrice}</span>
            <span class="old-price">${formattedOldPrice}</span>
          </div>
          <a href="product.html?id=${product.id}" class="details-btn">View Details</a>
        </div>
      </div>
    `;
    hotDealsGrid.innerHTML += productHTML;
  });
}

// Auto-refresh Hot Deals every 3 minutes
setInterval(() => {
  console.log("♻️ Auto-refreshing Hot Deals...");
  displayHotDeals();
}, 180000);

// ==============================
// Filters (Search + Category)
// ==============================
if (searchInput && categoryFilter) {
  searchInput.addEventListener("input", filterProducts);
  categoryFilter.addEventListener("change", filterProducts);
}

function filterProducts() {
  const searchValue = searchInput.value.toLowerCase();
  const selectedCategory = categoryFilter.value;

  const filtered = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchValue);
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  displayProducts(filtered);
}

// ==============================
// Shortcut to Admin Panel
// ==============================
document.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.shiftKey && e.key === "A") {
    window.location.href = "admin.html";
  }
});
