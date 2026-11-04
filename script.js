
const products = document.querySelectorAll(".product");
const cartButton = document.querySelector(".cart");

let cart = [];


// Add search field
const productsContainer = document.querySelector(".products");

const search = document.createElement("input");
search.className = "search-box";
search.placeholder = "Search products...";

productsContainer.parentElement.insertBefore(
  search,
  productsContainer
);

// Search products
search.addEventListener("input", () => {
  const value = search.value.toLowerCase();

  products.forEach(product => {
    const name = product.querySelector("h3").textContent.toLowerCase();

    product.style.display = name.includes(value)
      ? ""
      : "none";
  });
});

// Create cart panel
const panel = document.createElement("div");
panel.className = "cart-panel";
document.body.appendChild(panel);

function renderCart() {
  let total = 0;
  let count = 0;

  panel.innerHTML = `
    <button class="close-cart" aria-label="Close cart">×</button>
    <h2>Your Shopping Bag</h2>
    <div class="cart-items"></div>
    <h3 class="cart-total"></h3>
  `;

  panel.querySelector(".close-cart").addEventListener("click", () => {
    panel.classList.remove("open");
  });

  const itemsContainer = panel.querySelector(".cart-items");

  cart.forEach((item, index) => {
    total += item.price * item.quantity;
    count += item.quantity;

    const itemElement = document.createElement("div");
    itemElement.className = "cart-item";

    itemElement.innerHTML = `
      <strong>${item.name}</strong>
      <p>$${item.price} × ${item.quantity}</p>
      <button data-action="minus">−</button>
      <button data-action="plus">+</button>
      <button data-action="remove">Remove</button>
    `;

    itemElement.querySelector('[data-action="minus"]').onclick = () => {
      item.quantity--;

      if (item.quantity <= 0) {
        cart.splice(index, 1);
      }

      renderCart();
    };

    itemElement.querySelector('[data-action="plus"]').onclick = () => {
      item.quantity++;
      renderCart();
    };

    itemElement.querySelector('[data-action="remove"]').onclick = () => {
      cart.splice(index, 1);
      renderCart();
    };

    itemsContainer.appendChild(itemElement);
  });

  panel.querySelector(".cart-total").textContent =
    `Total: $${total}`;

  cartButton.textContent = `Shopping Bag (${count})`;
}

// Add buttons to products
products.forEach(product => {
  const name = product.querySelector("h3").textContent;
  const priceText = product.querySelector("strong").textContent;
  const price = Number(priceText.replace(/[^0-9.]/g, ""));

  const button = document.createElement("button");
  button.className = "add-to-cart";
  button.textContent = "Add to Bag";

  button.addEventListener("click", () => {
    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
      existingItem.quantity++;
    } else {
      cart.push({
        name: name,
        price: price,
        quantity: 1
      });
    }

    renderCart();
    panel.classList.add("open");
  });

  product.querySelector(".product-details").appendChild(button);
});

// Open cart
cartButton.addEventListener("click", () => {
  renderCart();
  panel.classList.toggle("open");
});

renderCart();
