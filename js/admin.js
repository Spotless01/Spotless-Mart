// ==============================
// Admin Panel Access Check
// ==============================
if (localStorage.getItem("adminAuth") !== "true") {
  window.location.href = "admin-login.html";
}

// ==============================
// Admin Panel Script (with Unique IDs & Image Upload)
// ==============================

const form = document.getElementById("product-form");
const tableBody = document.querySelector("#product-table tbody");
const imageInput = document.getElementById("product-image");
const preview = document.getElementById("image-preview");

let products = JSON.parse(localStorage.getItem("products")) || [];
let currentImageBase64 = "";

// Ensure all products have unique IDs
products = products.map(p => ({
  ...p,
  id: p.id || Date.now().toString() + Math.random().toString(36).substr(2, 9),
}));
localStorage.setItem("products", JSON.stringify(products));

renderProducts();

// ==============================
// IMAGE UPLOAD HANDLING
// ==============================
imageInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      currentImageBase64 = reader.result;
      preview.src = reader.result;
      preview.style.display = "block";
    };
    reader.readAsDataURL(file);
  }
});

// ==============================
// ADD / EDIT PRODUCT
// ==============================
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const index = document.getElementById("product-index").value;
  const name = document.getElementById("product-name").value.trim();
  const category = document.getElementById("product-category").value.trim();
  const price = parseFloat(document.getElementById("product-price").value);
  const oldPrice = parseFloat(document.getElementById("product-oldprice").value) || "";
  const description = document.getElementById("product-description").value.trim();

  if (!name || !category || !price) {
    alert("Please fill in all required fields.");
    return;
  }

  // Use existing image if editing and no new one is uploaded
  if (!currentImageBase64 && index !== "") {
    currentImageBase64 = products[index].image;
  }

  const newProduct = {
    id: index === "" ? Date.now().toString() + Math.random().toString(36).substr(2, 9) : products[index].id,
    name,
    category,
    image: currentImageBase64,
    price,
    oldPrice,
    description,
  };

  if (index === "") {
    // Add new product
    products.push(newProduct);
  } else {
    // Update existing
    products[index] = newProduct;
  }

  localStorage.setItem("products", JSON.stringify(products));
  form.reset();
  preview.style.display = "none";
  currentImageBase64 = "";
  document.getElementById("product-index").value = "";
  renderProducts();
});

// ==============================
// RENDER PRODUCTS
// ==============================
function renderProducts() {
  tableBody.innerHTML = "";

  if (products.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:#777;">No products yet.</td></tr>`;
    return;
  }

  products.forEach((product, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${index + 1}</td>
      <td><img src="${product.image}" alt="${product.name}" style="width:50px;height:50px;border-radius:8px;object-fit:cover;"></td>
      <td>${product.name}</td>
      <td>${product.category}</td>
      <td>₵${product.price}</td>
      <td>
        <button class="action-btn edit" onclick="editProduct(${index})">Edit</button>
        <button class="action-btn delete" onclick="deleteProduct(${index})">Delete</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

// ==============================
// EDIT PRODUCT
// ==============================
window.editProduct = (index) => {
  const product = products[index];
  document.getElementById("product-index").value = index;
  document.getElementById("product-name").value = product.name;
  document.getElementById("product-category").value = product.category;
  document.getElementById("product-price").value = product.price;
  document.getElementById("product-oldprice").value = product.oldPrice;
  document.getElementById("product-description").value = product.description;

  preview.src = product.image;
  preview.style.display = "block";
  currentImageBase64 = product.image;

  window.scrollTo({ top: 0, behavior: "smooth" });
};

// ==============================
// DELETE PRODUCT
// ==============================
window.deleteProduct = (index) => {
  if (confirm("Are you sure you want to delete this product?")) {
    products.splice(index, 1);
    localStorage.setItem("products", JSON.stringify(products));
    renderProducts();
  }
};

// ==============================
// LOGOUT FUNCTION
// ==============================
function logoutAdmin() {
  localStorage.removeItem("adminAuth");
  window.location.href = "admin-login.html";
}
