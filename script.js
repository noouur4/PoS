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
    category: "Sandwiches",
    icon: "🥗",
    color: "#06b6d4",
  },
];

document.addEventListener("DOMContentLoaded", function () {
  const menuContainer = document.getElementById("menuContainer");

  // 1. Dynamically generate cards from the Items array matching the second design
  Items.forEach(function (item) {
    const col = document.createElement("div");
    col.className = "col-md-4 mb-3"; // Bootstrap grid column class

    // Check if the icon is a Bootstrap class or an emoji/text character
    const iconHtml = item.icon.includes("bi")
      ? `<i class="${item.icon}"></i>`
      : item.icon;

    col.innerHTML = `
            <div class="card menu-card h-100" data-id="${item.id}" data-name="${item.name}" data-price="${item.price}">
                <div class="card-body p-4 d-flex flex-column">
                    <div class="d-flex align-items-center mb-3">
                        <div class="icon-box me-3 rounded-4 d-flex align-items-center justify-content-center" style="width: 55px; height: 55px; min-width: 55px; background-color: #2b1f1a; color: #d4a373;">
                            ${iconHtml}
                        </div>
                        <div class="overflow-hidden">
                            <h5 class="card-title text-truncate mb-1 fs-6 fw-bold">${item.name}</h5>
                            <span class="badge bg-light text-secondary border px-3 py-1 rounded-pill fw-normal" style="font-size: 0.75rem;">${item.category}</span>
                        </div>
                    </div>
                    <h4 class="price mb-4">$${item.price.toFixed(2)}</h4>
                    <div class="mt-auto">
                        <button type="button" class="btn btn-add w-100 mb-2">Add +</button>
                        <button type="button" class="btn btn-remove w-100">Remove -</button>
                    </div>
                </div>
            </div>
        `;
    menuContainer.appendChild(col);
  });
  const cards = document.querySelectorAll(".menu-card");
  const grandCount = document.getElementById("grandCount");
  const grandTotal = document.getElementById("grandTotal");
  const clearBtn = document.getElementById("clearBtn");
  const cartItemsList = document.getElementById("cartItemsList");
  const emptyCartMsg = document.getElementById("emptyCartMsg");
  const completeSaleBtn = document.getElementById("completeSaleBtn");
  const receiptContent = document.getElementById("receiptContent");
  const receiptTotal = document.getElementById("receiptTotal");
  const newOrderBtn = document.getElementById("newOrderBtn");

  const cart = {};

  cards.forEach(function (card) {
    const id = card.dataset.id;
    const name = card.dataset.name;
    const price = parseFloat(card.dataset.price);

    cart[id] = { name, price, count: 0 };

    const btnAdd = card.querySelector(".btn-add");
    const btnRmv = card.querySelector(".btn-remove");

    btnAdd.addEventListener("click", function () {
      cart[id].count++;
      updateCartUI();
    });

    btnRmv.addEventListener("click", function () {
      if (cart[id].count > 0) {
        cart[id].count--;
        updateCartUI();
      }
    });
  });

  function money(n) {
    return "$" + n.toFixed(2);
  }

  function updateCartUI() {
    // Clear list safely using textContent or standard loop
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

        // Create main item row container
        const itemEl = document.createElement("div");
        itemEl.className =
          "d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom";

        // Left side: Product Name & Pricing info
        const leftDiv = document.createElement("div");
        const titleEl = document.createElement("h6");
        titleEl.className = "mb-0 fw-bold";
        titleEl.textContent = item.name;

        const smallEl = document.createElement("small");
        smallEl.className = "text-muted";
        smallEl.textContent = `${money(item.price)} × ${item.count}`;

        leftDiv.appendChild(titleEl);
        leftDiv.appendChild(smallEl);

        // Right side: Price subtotal and Delete button container
        const rightDiv = document.createElement("div");
        rightDiv.className = "d-flex align-items-center gap-2 text-end";

        const priceSpan = document.createElement("span");
        priceSpan.className = "fw-bold";
        priceSpan.textContent = money(itemTotal);

        // --- NEW DELETE BUTTON ---
        const deleteBtn = document.createElement("button");
        deleteBtn.type = "button";
        deleteBtn.className = "btn btn-sm btn-outline-danger py-0 px-2";
        deleteBtn.textContent = "Remove item";
        deleteBtn.title = "Remove item";

        // Add event listener to delete/remove the item completely
        deleteBtn.addEventListener("click", function () {
          cart[id].count = 0; // Reset count to 0
          updateCartUI(); // Refresh the cart UI
        });

        rightDiv.appendChild(priceSpan);
        rightDiv.appendChild(deleteBtn);

        itemEl.appendChild(leftDiv);
        itemEl.appendChild(rightDiv);

        cartItemsList.appendChild(itemEl);
      }
    }

    if (hasItems) {
      emptyCartMsg.style.display = "none";
      completeSaleBtn.disabled = false;
    } else {
      emptyCartMsg.style.display = "block";
      completeSaleBtn.disabled = true;
    }

    grandCount.textContent = totalItems;
    grandTotal.textContent = money(subtotal);
  }

  clearBtn.addEventListener("click", function () {
    for (let id in cart) {
      cart[id].count = 0;
    }
    updateCartUI();
  });

  completeSaleBtn.addEventListener("click", function () {
    receiptContent.textContent = "";
    let finalSum = 0;

    for (let id in cart) {
      const item = cart[id];
      if (item.count > 0) {
        const itemTotal = item.count * item.price;
        finalSum += itemTotal;

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
});

// --- LIVE CLOCK FUNCTION ---
function updateClock() {
  const clockElement = document.getElementById("liveClock");
  if (clockElement) {
    const now = new Date();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";

    // Convert to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const formattedHours = String(hours).padStart(2, "0");

    clockElement.textContent = `${formattedHours}:${minutes}:${seconds} ${ampm}`;
  }
}

// Run immediately, then update every second
updateClock();
setInterval(updateClock, 1000);
