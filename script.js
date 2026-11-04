
const products = document.querySelectorAll(".product");
const cartButton = document.querySelector(".cart");

let cart = JSON.parse(localStorage.getItem("northline-cart")) || [];


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
localStorage.setItem("northline-cart", JSON.stringify(cart));
  panel.innerHTML = `
    <button class="close-cart" aria-label="Close cart">×</button>
    <h2>Your Shopping Bag</h2>
    <div class="cart-items"></div>
    <h3 class="cart-total"></h3>
  `;

  panel.querySelector(".close-cart").addEventListener("click", () => {
    panel.classList.remove("open");
    
// Checkout button
if (cart.length > 0) {
  const checkout = document.createElement("button");

  checkout.className = "add-to-cart";
  checkout.textContent = "PROCEED TO CHECKOUT";

  panel.appendChild(checkout);

  checkout.addEventListener("click", () => {
    panel.innerHTML = `
      <button class="close-cart">×</button>
      <h2>Checkout</h2>

      <form id="checkout-form">
        <input name="name" placeholder="Full Name" required
          style="width:100%;padding:13px;margin:8px 0;box-sizing:border-box">

        <input name="email" type="email" placeholder="Email Address" required
          style="width:100%;padding:13px;margin:8px 0;box-sizing:border-box">

        <input name="phone" type="tel" placeholder="Phone Number" required
          style="width:100%;padding:13px;margin:8px 0;box-sizing:border-box">

        <textarea name="address" placeholder="Delivery Address" required
          style="width:100%;padding:13px;margin:8px 0;box-sizing:border-box"></textarea>

        <h3>Order Total: $${total}</h3>

        <button class="add-to-cart" type="submit">
          PLACE ORDER
        </button>
      </form>
    `;

    panel.querySelector(".close-cart").onclick = () => {
      panel.classList.remove("open");
    };

    panel.querySelector("#checkout-form").addEventListener("submit", (e) => {
      e.preventDefault();

      const customer = Object.fromEntries(new FormData(e.target));

      panel.innerHTML = `
        <h2>Thank You!</h2>
        <p>Your order has been placed successfully.</p>
        <p>Thank you, ${customer.name}.</p>
        <p>Order Total: $${total}</p>
        <button class="add-to-cart" onclick="location.reload()">
          CONTINUE SHOPPING
        </button>
      `;

      cart = [];
      localStorage.setItem("northline-cart", JSON.stringify(cart));
    });
  });
}

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
