const PRODUCT_CATALOG = [
  { id: "p1", name: "Truffle Burrata Flatbread", category: "Chef Signature", price: 620, description: "Wood-fired flatbread with truffle cream, burrata and basil oil.", badge: "best seller" },
  { id: "p2", name: "Saffron Seafood Risotto", category: "Main Course", price: 890, description: "Arborio rice slow-cooked in lobster stock with prawns, calamari and saffron.", badge: "premium" },
  { id: "p3", name: "Smoked Lamb Chops", category: "Grill", price: 980, description: "Charred lamb chops, garlic jus, herb butter and roasted root vegetables.", badge: "chef pick" },
  { id: "p4", name: "Wild Mushroom Velouté", category: "Starter", price: 420, description: "Silky mushroom soup finished with thyme cream and sourdough crisps.", badge: "new" },
  { id: "p5", name: "Citrus Herb Salmon", category: "Main Course", price: 860, description: "Pan-seared salmon with lemon beurre blanc and grilled asparagus.", badge: "healthy" },
  { id: "p6", name: "Royal Dum Biryani", category: "Indian Royal", price: 690, description: "Fragrant basmati layered with marinated meat, saffron and caramelized onions.", badge: "classic" },
  { id: "p7", name: "Dark Chocolate Dome", category: "Dessert", price: 390, description: "Valrhona chocolate mousse dome with salted caramel and hazelnut crunch.", badge: "dessert" },
  { id: "p8", name: "Rose Pistachio Kulfi", category: "Dessert", price: 320, description: "Traditional kulfi with rose syrup, pistachio crumble and saffron threads.", badge: "house special" }
];

const CHATBOT_QA = [
  {
    question: "Do you offer vegetarian and vegan options?",
    answer: "Yes. Our menu clearly marks vegetarian and vegan dishes, and our chefs can customize most items on request."
  },
  {
    question: "How can I place an order quickly?",
    answer: "Go to the Order page, select your dishes and quantity, then submit. Your cart updates instantly for checkout."
  },
  {
    question: "What are your delivery timings?",
    answer: "We deliver daily from 11:00 AM to 11:30 PM across our active service zones."
  },
  {
    question: "Can I host private events?",
    answer: "Absolutely. Visit Contact Us and mention event date, guest count and preferences. Our team will call you back."
  }
];

const STORAGE_KEY = "restaurantWebsiteCart";

const formatINR = (value) => `₹${Number(value).toLocaleString("en-IN")}`;

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  updateCartCount();
}

function addToCart(productId, quantity = 1) {
  const qty = Math.max(1, Number(quantity) || 1);
  const cart = getCart();
  const existing = cart.find((item) => item.productId === productId);
  if (existing) {
    existing.quantity += qty;
  } else {
    cart.push({ productId, quantity: qty });
  }
  saveCart(cart);
}

function updateCartCount() {
  const count = getCart().reduce((total, item) => total + item.quantity, 0);
  document.querySelectorAll(".cart-count").forEach((el) => {
    el.textContent = count;
  });
}

function activateCurrentNav() {
  const page = document.body.dataset.page;
  document.querySelectorAll(".nav-links a[data-page]").forEach((link) => {
    if (link.dataset.page === page) link.classList.add("active");
  });
}

function renderFeaturedProducts() {
  const root = document.getElementById("featuredProducts");
  if (!root) return;
  root.innerHTML = PRODUCT_CATALOG.slice(0, 4)
    .map(
      (item, i) => `
      <article class="card item-card" style="animation-delay:${i * 80}ms">
        <div class="item-top">
          <span class="badge">${item.badge}</span>
          <span class="price">${formatINR(item.price)}</span>
        </div>
        <h3>${item.name}</h3>
        <p class="muted">${item.description}</p>
        <button class="btn btn-secondary" data-add="${item.id}">Add to cart</button>
      </article>
    `
    )
    .join("");
}

function renderProductsGrid() {
  const root = document.getElementById("productsGrid");
  if (!root) return;
  root.innerHTML = PRODUCT_CATALOG.map(
    (item, i) => `
      <article class="card item-card" style="animation-delay:${i * 80}ms">
        <div class="item-top">
          <div>
            <span class="badge">${item.category}</span>
          </div>
          <span class="price">${formatINR(item.price)}</span>
        </div>
        <h3>${item.name}</h3>
        <p class="muted">${item.description}</p>
        <div class="cart-actions">
          <button class="btn btn-secondary" data-add="${item.id}">Add to Cart</button>
          <a class="btn btn-primary" href="order.html?product=${item.id}">Order Now</a>
        </div>
      </article>
    `
  ).join("");
}

function renderMenuTable() {
  const root = document.getElementById("menuTableBody");
  if (!root) return;
  root.innerHTML = PRODUCT_CATALOG.map(
    (item) => `
      <tr>
        <td>${item.name}</td>
        <td>${item.category}</td>
        <td>${formatINR(item.price)}</td>
        <td><button class="btn btn-secondary" data-add="${item.id}">Add</button></td>
      </tr>
    `
  ).join("");
}

function renderOrderForm() {
  const productSelect = document.getElementById("orderProduct");
  const qtyInput = document.getElementById("orderQty");
  const totalEl = document.getElementById("orderTotal");
  const form = document.getElementById("orderForm");
  const notice = document.getElementById("orderNotice");
  if (!productSelect || !qtyInput || !totalEl || !form || !notice) return;

  const params = new URLSearchParams(window.location.search);
  const selectedProduct = params.get("product");

  productSelect.innerHTML = PRODUCT_CATALOG.map(
    (item) => `<option value="${item.id}">${item.name} — ${formatINR(item.price)}</option>`
  ).join("");

  if (selectedProduct && PRODUCT_CATALOG.some((item) => item.id === selectedProduct)) {
    productSelect.value = selectedProduct;
  }

  const recalc = () => {
    const product = PRODUCT_CATALOG.find((item) => item.id === productSelect.value);
    const qty = Math.max(1, Number(qtyInput.value) || 1);
    totalEl.textContent = formatINR((product?.price || 0) * qty);
  };

  productSelect.addEventListener("change", recalc);
  qtyInput.addEventListener("input", recalc);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const product = PRODUCT_CATALOG.find((item) => item.id === productSelect.value);
    const qty = Math.max(1, Number(qtyInput.value) || 1);
    addToCart(product.id, qty);
    notice.hidden = false;
    notice.textContent = `${qty} × ${product.name} added to cart. Go to Cart for checkout.`;
  });

  recalc();
}

function renderCartPage() {
  const root = document.getElementById("cartBody");
  const subtotalEl = document.getElementById("cartSubtotal");
  const taxEl = document.getElementById("cartTax");
  const finalEl = document.getElementById("cartFinal");
  const emptyEl = document.getElementById("cartEmpty");
  const clearBtn = document.getElementById("clearCart");
  if (!root || !subtotalEl || !taxEl || !finalEl || !emptyEl || !clearBtn) return;

  const render = () => {
    const cart = getCart();
    if (!cart.length) {
      root.innerHTML = "";
      emptyEl.hidden = false;
      subtotalEl.textContent = formatINR(0);
      taxEl.textContent = formatINR(0);
      finalEl.textContent = formatINR(0);
      return;
    }

    emptyEl.hidden = true;
    root.innerHTML = cart
      .map((entry) => {
        const product = PRODUCT_CATALOG.find((item) => item.id === entry.productId);
        if (!product) return "";
        const lineTotal = product.price * entry.quantity;
        return `
          <tr>
            <td>${product.name}</td>
            <td>${formatINR(product.price)}</td>
            <td>
              <input class="form qty" type="number" min="1" value="${entry.quantity}" data-qty="${product.id}" />
            </td>
            <td>${formatINR(lineTotal)}</td>
            <td><button class="btn btn-secondary" data-remove="${product.id}">Remove</button></td>
          </tr>
        `;
      })
      .join("");

    const subtotal = cart.reduce((sum, entry) => {
      const product = PRODUCT_CATALOG.find((item) => item.id === entry.productId);
      return sum + (product ? product.price * entry.quantity : 0);
    }, 0);
    const tax = subtotal * 0.05;
    const final = subtotal + tax;

    subtotalEl.textContent = formatINR(subtotal);
    taxEl.textContent = formatINR(tax);
    finalEl.textContent = formatINR(final);
  };

  root.addEventListener("input", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement) || !target.dataset.qty) return;
    const cart = getCart();
    const item = cart.find((entry) => entry.productId === target.dataset.qty);
    if (!item) return;
    item.quantity = Math.max(1, Number(target.value) || 1);
    saveCart(cart);
    render();
  });

  root.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement) || !target.dataset.remove) return;
    const cart = getCart().filter((entry) => entry.productId !== target.dataset.remove);
    saveCart(cart);
    render();
  });

  clearBtn.addEventListener("click", () => {
    saveCart([]);
    render();
  });

  render();
}

function bindAddToCartButtons() {
  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const button = target.closest("[data-add]");
    if (!(button instanceof HTMLElement) || !button.dataset.add) return;
    addToCart(button.dataset.add, 1);
    button.textContent = "Added ✓";
    setTimeout(() => {
      button.textContent = button.classList.contains("btn-secondary") ? "Add to cart" : "Add";
    }, 1000);
  });
}

function mountChatbot() {
  const mount = document.createElement("section");
  mount.className = "chatbot";
  mount.innerHTML = `
    <div id="chatbotRoot" class="chatbot">
      <button class="chatbot-toggle" id="chatbotToggle" aria-label="Open chatbot">💬</button>
      <div class="chatbot-panel">
        <div class="chatbot-head">
          <strong>Concierge Bot</strong>
          <button class="btn btn-secondary" id="chatbotClose">×</button>
        </div>
        <div class="chatbot-body" id="chatbotBody">
          <div class="chat-line bot">Hi! I can help with menu, order, timings and events. Tap a question below.</div>
          <div class="question-grid" id="questionGrid"></div>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(mount);

  const root = document.getElementById("chatbotRoot");
  const toggle = document.getElementById("chatbotToggle");
  const close = document.getElementById("chatbotClose");
  const qGrid = document.getElementById("questionGrid");
  const body = document.getElementById("chatbotBody");

  if (!root || !toggle || !close || !qGrid || !body) return;

  qGrid.innerHTML = CHATBOT_QA.map(
    (item, index) => `<button class="question-btn" data-q="${index}">${item.question}</button>`
  ).join("");

  const appendLine = (text, type) => {
    const line = document.createElement("div");
    line.className = `chat-line ${type}`;
    line.textContent = text;
    body.appendChild(line);
    body.scrollTop = body.scrollHeight;
  };

  toggle.addEventListener("click", () => root.classList.toggle("open"));
  close.addEventListener("click", () => root.classList.remove("open"));

  qGrid.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement) || !target.dataset.q) return;
    const item = CHATBOT_QA[Number(target.dataset.q)];
    appendLine(item.question, "user");
    appendLine(item.answer, "bot");
  });
}

function bindContactForm() {
  const form = document.getElementById("contactForm");
  const notice = document.getElementById("contactNotice");
  if (!form || !notice) return;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    notice.hidden = false;
    form.reset();
  });
}

function bindNewsletterForm() {
  const form = document.getElementById("newsletterForm");
  const notice = document.getElementById("newsletterNotice");
  if (!form || !notice) return;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    notice.hidden = false;
    form.reset();
  });
}

function init() {
  activateCurrentNav();
  updateCartCount();
  renderFeaturedProducts();
  renderProductsGrid();
  renderMenuTable();
  renderOrderForm();
  renderCartPage();
  bindAddToCartButtons();
  bindContactForm();
  bindNewsletterForm();
  mountChatbot();
}

document.addEventListener("DOMContentLoaded", init);
