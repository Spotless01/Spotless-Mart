// ==============================
// MAIN SCRIPT — GitHub Pages Ready
// ==============================

// Selectors
const productList = document.getElementById("product-grid");
const searchInput = document.getElementById("search-input");
const categoryFilter = document.getElementById("category-filter");

let products = [];

// ==============================
// Load Products from data/products.json
// ==============================
fetch("data/products.json")
  .then(res => res.json())
  .then(data => {
    products = data;
    localStorage.setItem("products", JSON.stringify(products)); // cache locally
    if (productList) displayProducts(products);
    if (document.getElementById("hot-deals-grid")) displayHotDeals();
  })
  .catch(err => console.error("❌ Error loading products:", err));

// ==============================
// Helper — Format Currency
// ==============================
function formatPrice(value) {
  return new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
    minimumFractionDigits: 2,
  }).format(value);
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

  productArray.forEach((product) => {
    const productHTML = `
      <div class="product-card">
        <div class="product-image-wrapper">
          <img src="${product.image}" alt="${product.name}" class="product-img">
        </div>
        <div class="product-info">
          <h3 class="product-title">${product.name}</h3>
          <div class="product-price">
            <span class="current-price">${formatPrice(product.price)}</span>
            ${product.oldPrice ? `<span class="old-price">${formatPrice(product.oldPrice)}</span>` : ""}
          </div>
          <a href="product.html?id=${encodeURIComponent(product.name)}" class="details-btn">View Details</a>
        </div>
      </div>
    `;
    productList.innerHTML += productHTML;
  });
}

// ==============================
// HOT DEALS
// ==============================
function displayHotDeals() {
  const hotDealsGrid = document.getElementById("hot-deals-grid");
  if (!hotDealsGrid) return;

  const hotDeals = products.filter(p => p.oldPrice && p.oldPrice > p.price);

  if (hotDeals.length === 0) {
    hotDealsGrid.innerHTML = `<p style="text-align:center;color:#777;">No hot deals right now 🔥</p>`;
    return;
  }

  hotDealsGrid.innerHTML = hotDeals.map(product => `
    <div class="product-card hot-deal">
      <div class="product-image-wrapper">
        <span class="hot-badge">🔥 Hot</span>
        <img src="${product.image}" alt="${product.name}" class="product-img">
      </div>
      <div class="product-info">
        <h3 class="product-title">${product.name}</h3>
        <div class="product-price">
          <span class="current-price">${formatPrice(product.price)}</span>
          <span class="old-price">${formatPrice(product.oldPrice)}</span>
        </div>
        <a href="product.html?id=${encodeURIComponent(product.name)}" class="details-btn">View Deal</a>
      </div>
    </div>
  `).join("");
}

// Auto-refresh hot deals every 3 minutes
setInterval(() => {
  displayHotDeals();
}, 180000);

// ==============================
// Filters
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
// Shortcut: Open Admin
// ==============================
document.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.shiftKey && e.key === "A") {
    window.location.href = "admin.html";
  }
});
