const Items = [
  {
    id: 1,
    name: "Espresso",
    price: 2.5,
    category: "Beverages",
    icon: "bi-cup-hot",
    color: "#38bdf8",
  },
  {
    id: 2,
    name: "Cappuccino",
    price: 3.5,
    category: "Beverages",
    icon: "bi-cup-hot",
    color: "#f59e0b",
  },
  {
    id: 3,
    name: "Croissant",
    price: 2.75,
    category: "Bakery",
    icon: "🥐",
    color: "#10b981",
  },
  {
    id: 4,
    name: "Blueberry Muffin",
    price: 3.0,
    category: "Bakery",
    icon: "🧁",
    color: "#ec4899",
  },
  {
    id: 5,
    name: "Club Sandwich",
    price: 6.5,
    category: "Sandwiches",
    icon: "🥪",
    color: "#ef4444",
  },
  {
    id: 6,
    name: "Caesar Salad",
    price: 5.75,
    category: "Salads",
    icon: "🥗",
    color: "#06b6d4",
  },
];

document.addEventListener("DOMContentLoaded", function () {
  const menuContainer = document.getElementById("menuContainer");
  const filterButtons = document.querySelectorAll(".filter-btn");

  const grandCount = document.getElementById("grandCount");
  const grandTotal = document.getElementById("grandTotal");
  const clearBtn = document.getElementById("clearBtn");
  const cartItemsList = document.getElementById("cartItemsList");
  const emptyCartMsg = document.getElementById("emptyCartMsg");
  const completeSaleBtn = document.getElementById("completeSaleBtn");
  const receiptContent = document.getElementById("receiptContent");
  const receiptTotal = document.getElementById("receiptTotal");
  const newOrderBtn = document.getElementById("newOrderBtn");
  const confirmCancelBtn = document.getElementById("confirmCancelBtn");
  const cancelModal = new bootstrap.Modal(
    document.getElementById("cancelModal"),
  );
  const brownColor = "#2b1f1a";
  const cart = {};

  // Initialize cart counts for all items beforehand
  Items.forEach((item) => {
    cart[item.id] = { name: item.name, price: item.price, count: 0 };
  });

  // 1. STYLE & SETUP FILTER BUTTONS ON LOAD
  filterButtons.forEach((btn) => {
    btn.style.borderColor = brownColor;
    if (btn.dataset.category === "All") {
      btn.style.backgroundColor = brownColor;
      btn.style.color = "#ffffff";
      btn.classList.add("active");
    } else {
      btn.style.backgroundColor = "transparent";
      btn.style.color = "#212529";
    }
  });

  // 2. FILTER BUTTON CLICK EVENTS
  filterButtons.forEach((button) => {
    button.addEventListener("click", function () {
      filterButtons.forEach((btn) => {
        btn.style.backgroundColor = "transparent";
        btn.style.color = "#212529";
        btn.classList.remove("active");
      });

      this.style.backgroundColor = brownColor;
      this.style.color = "#ffffff";
      this.classList.add("active");

      const selectedCategory = this.dataset.category;
      renderProducts(selectedCategory);
    });
  });

  // 3. RENDER PRODUCTS DYNAMICALLY BASED ON CATEGORY
  function renderProducts(categoryFilter = "All") {
    menuContainer.textContent = "";

    const filteredItems =
      categoryFilter === "All"
        ? Items
        : Items.filter((item) => item.category === categoryFilter);

    filteredItems.forEach(function (item) {
      const col = document.createElement("div");
      col.className = "col-md-4 mb-3";

      const iconHtml = item.icon.includes("bi")
        ? `<i class="${item.icon}"></i>`
        : item.icon;

      col.innerHTML = `
                <div class="card menu-card h-100" data-id="${item.id}" data-name="${item.name}" data-price="${item.price}">
                    <div class="card-body p-4 d-flex flex-column">
                        <div class="d-flex align-items-center mb-3">
                            <div class="icon-box me-3 rounded-4 d-flex align-items-center justify-content-center" style="width: 55px; height: 55px; min-width: 55px; background-color: ${brownColor}; color: #d4a373;">
                                ${iconHtml}
                            </div>
                            <div class="overflow-hidden">
                                <h5 class="card-title text-truncate mb-1 fs-6 fw-bold">${item.name}</h5>
                                <span class="badge bg-light text-secondary border px-3 py-1 rounded-pill fw-normal" style="font-size: 0.75rem;">${item.category}</span>
                            </div>
                        </div>
                        <h4 class="price mb-4">$${item.price.toFixed(2)}</h4>
                        <div class="mt-auto">
                            <button type="button" class="btn btn-add w-100 mb-2" style="background-color: ${brownColor}; color: white;">Add +</button>
                            <button type="button" class="btn btn-remove w-100" style="background-color: ${brownColor}; color: white;">Remove -</button>
                        </div>
                    </div>
                </div>
            `;
      menuContainer.appendChild(col);
    });
  }

  // 4. EVENT DELEGATION FOR ADD & REMOVE BUTTONS
  menuContainer.addEventListener("click", function (e) {
    const card = e.target.closest(".menu-card");
    if (!card) return;
    const id = card.dataset.id;

    if (e.target.classList.contains("btn-add")) {
      cart[id].count++;
      updateCartUI();
    } else if (e.target.classList.contains("btn-remove")) {
      if (cart[id].count > 0) {
        cart[id].count--;
        updateCartUI();
      }
    }
  });

  function money(n) {
    return "$" + n.toFixed(2);
  }

  function clearCart() {
    for (let id in cart) {
      cart[id].count = 0;
    }
    updateCartUI();
  }

  // 5. UPDATE CART UI (WITH 10% DISCOUNT OVER $100)
  function updateCartUI() {
    cartItemsList.textContent = "";
    let totalItems = 0;
    let subtotal = 0;
    let hasItems = false;

    for (let id in cart) {
      const item = cart[id];
      if (item.count > 0) {
        hasItems = true;
        totalItems += item.count;
        const itemTotal = item.count * item.price;
        subtotal += itemTotal;

        const itemEl = document.createElement("div");
        itemEl.className =
          "d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom";

        const leftDiv = document.createElement("div");
        const titleEl = document.createElement("h6");
        titleEl.className = "mb-0 fw-bold";
        titleEl.textContent = item.name;

        const smallEl = document.createElement("small");
        smallEl.className = "text-muted";
        smallEl.textContent = `${money(item.price)} × ${item.count}`;

        leftDiv.appendChild(titleEl);
        leftDiv.appendChild(smallEl);

        const rightDiv = document.createElement("div");
        rightDiv.className = "d-flex align-items-center gap-2 text-end";

        const priceSpan = document.createElement("span");
        priceSpan.className = "fw-bold";
        priceSpan.textContent = money(itemTotal);

        const deleteBtn = document.createElement("button");
        deleteBtn.type = "button";
        deleteBtn.className = "btn btn-sm btn-outline-danger py-0 px-2";
        deleteBtn.textContent = "Remove item";

        deleteBtn.addEventListener("click", function () {
          cart[id].count = 0;
          updateCartUI();
        });

        rightDiv.appendChild(priceSpan);
        rightDiv.appendChild(deleteBtn);
        itemEl.appendChild(leftDiv);
        itemEl.appendChild(rightDiv);
        cartItemsList.appendChild(itemEl);
      }
    }

    // 10% Discount calculation if subtotal > 100
    let discount = subtotal > 100 ? subtotal * 0.1 : 0;
    let finalAmount = subtotal - discount;

    if (hasItems) {
      emptyCartMsg.style.display = "none";
      completeSaleBtn.disabled = false;
    } else {
      emptyCartMsg.style.display = "block";
      completeSaleBtn.disabled = true;
    }

    grandCount.textContent = totalItems;
    grandTotal.textContent = money(finalAmount);
  }

  clearBtn.addEventListener("click", function () {
    // Check if the cart has anything in it
    let hasItems = false;
    for (let id in cart) {
      if (cart[id].count > 0) {
        hasItems = true;
      }
    }

    // Nothing to cancel, so don't show the pop-up
    if (!hasItems) {
      return;
    }

    cancelModal.show();
  });

  confirmCancelBtn.addEventListener("click", function () {
    clearCart();
    cancelModal.hide();
  });

  completeSaleBtn.addEventListener("click", function () {
    receiptContent.textContent = "";
    let subtotal = 0;

    for (let id in cart) {
      const item = cart[id];
      if (item.count > 0) {
        const itemTotal = item.count * item.price;
        subtotal += itemTotal;

        const row = document.createElement("div");
        row.className = "d-flex justify-content-between mb-2";

        const leftSpan = document.createElement("span");
        leftSpan.textContent = `${item.name} (x${item.count})`;

        const rightSpan = document.createElement("span");
        rightSpan.textContent = money(itemTotal);

        row.appendChild(leftSpan);
        row.appendChild(rightSpan);
        receiptContent.appendChild(row);
      }
    }

    let discount = subtotal > 100 ? subtotal * 0.1 : 0;
    let finalSum = subtotal - discount;

    if (discount > 0) {
      const discountRow = document.createElement("div");
      discountRow.className = "d-flex justify-content-between mb-2 text-danger";
      discountRow.innerHTML = `<span>10% Discount</span><span>-${money(discount)}</span>`;
      receiptContent.appendChild(discountRow);
    }

    receiptTotal.textContent = money(finalSum);

    const receiptModal = new bootstrap.Modal(
      document.getElementById("receiptModal"),
    );
    receiptModal.show();
  });

  newOrderBtn.addEventListener("click", function () {
    for (let id in cart) {
      cart[id].count = 0;
    }
    updateCartUI();
  });

  // Initial render call on page load
  renderProducts("All");
});

// --- 6. LIVE CLOCK FUNCTION ---
function updateClock() {
  const clockElement = document.getElementById("liveClock");
  if (clockElement) {
    const now = new Date();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12;
    hours = hours ? hours : 12;
    const formattedHours = String(hours).padStart(2, "0");

    clockElement.textContent = `${formattedHours}:${minutes}:${seconds} ${ampm}`;
  }
}

updateClock();
setInterval(updateClock, 1000);
