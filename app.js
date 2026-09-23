const products = [

  {
    id: 1,
    name: "Arc Floor Lamp",
    cat: "Home",
    price: 189,
    desc: "Brushed metal · Warm white",
    visual: "p1",
    shape: "tall",
    new: true
  },

  {
    id: 2,
    name: "Form Ceramic Vase",
    cat: "Home",
    price: 64,
    desc: "Stoneware · Sand",
    visual: "p2",
    shape: "round"
  },

  {
    id: 3,
    name: "Linen Overshirt",
    cat: "Wear",
    price: 118,
    desc: "European linen · Clay",
    visual: "p3",
    shape: "square",
    new: true
  },

  {
    id: 4,
    name: "Everyday Tote",
    cat: "Wear",
    price: 79,
    desc: "Organic canvas · Black",
    visual: "p4",
    shape: "square"
  },

  {
    id: 5,
    name: "No. 07 Candle",
    cat: "Objects",
    price: 38,
    desc: "Cedar · 45 hour burn",
    visual: "p5",
    shape: "tall"
  },

  {
    id: 6,
    name: "Oak Catchall",
    cat: "Objects",
    price: 52,
    desc: "Solid oak · Natural",
    visual: "p6",
    shape: "square"
  },

  {
    id: 7,
    name: "Ribbed Throw",
    cat: "Home",
    price: 96,
    desc: "Recycled wool · Oat",
    visual: "p7",
    shape: "round"
  },

  {
    id: 8,
    name: "Daily Watch",
    cat: "Objects",
    price: 145,
    desc: "Steel · Mineral glass",
    visual: "p8",
    shape: "round",
    new: true
  }

];


let cart = JSON.parse(
  localStorage.getItem("nova-cart") || "[]"
);


const $ = selector =>
  document.querySelector(selector);


const $$ = selector =>
  [...document.querySelectorAll(selector)];


function money(number) {

  return `$${number.toFixed(2)}`;

}


/* Render Products */

function renderProducts(list = products) {

  $("#products").innerHTML = list.map(product => `

    <article
      class="product-card"
      data-id="${product.id}"
    >

      <div class="product-image">

        ${
          product.new
            ? `<span class="badge">NEW</span>`
            : ""
        }

        <div class="
          product-visual
          ${product.visual}
        ">

          <div class="
            shape
            ${product.shape}
          "></div>

        </div>

      </div>


      <div class="product-info">

        <div>

          <h3>
            ${product.name}
          </h3>

          <p>
            ${product.desc}
          </p>

        </div>

        <span class="price">
          ${money(product.price)}
        </span>

      </div>

    </article>

  `).join("");


  $$(".product-card").forEach(card => {

    card.onclick = () => {

      addToCart(
        Number(card.dataset.id)
      );

    };

  });

}


/* Save Cart */

function saveCart() {

  localStorage.setItem(
    "nova-cart",
    JSON.stringify(cart)
  );

}


/* Add Product */

function addToCart(id) {

  const existing = cart.find(
    item => item.id === id
  );


  if (existing) {

    existing.qty++;

  } else {

    cart.push({
      id,
      qty: 1
    });

  }


  saveCart();

  renderCart();

  updateCount();

  toast("Added to your bag");

}


/* Cart Counter */

function updateCount() {

  const count = cart.reduce(
    (total, item) =>
      total + item.qty,
    0
  );

  $("#cartCount").textContent = count;

}


/* Render Cart */

function renderCart() {

  const box = $("#cartItems");


  if (!cart.length) {

    box.innerHTML = `
      <div class="empty">
        Your bag is waiting.
        <br>
        Add something you love.
      </div>
    `;

    $("#subtotal").textContent = "$0.00";

    return;

  }


  let total = 0;


  box.innerHTML = cart.map(item => {

    const product = products.find(
      product => product.id === item.id
    );


    total += product.price * item.qty;


    return `

      <div class="cart-row">

        <div class="mini-image">

          <div class="mini-shape"></div>

        </div>


        <div>

          <h4>
            ${product.name}
          </h4>

          <p>
            ${money(product.price)}
          </p>


          <div class="qty">

            <button
              data-minus="${product.id}"
            >
              −
            </button>

            <span>
              ${item.qty}
            </span>

            <button
              data-plus="${product.id}"
            >
              +
            </button>

          </div>

        </div>


        <span
          class="remove"
          data-remove="${product.id}"
        >
          Remove
        </span>

      </div>

    `;

  }).join("");


  $("#subtotal").textContent =
    money(total);


  $$("[data-plus]").forEach(button => {

    button.onclick = () => {

      changeQuantity(
        Number(button.dataset.plus),
        1
      );

    };

  });


  $$("[data-minus]").forEach(button => {

    button.onclick = () => {

      changeQuantity(
        Number(button.dataset.minus),
        -1
      );

    };

  });


  $$("[data-remove]").forEach(button => {

    button.onclick = () => {

      cart = cart.filter(
        item =>
          item.id !==
          Number(button.dataset.remove)
      );

      saveCart();

      renderCart();

      updateCount();

    };

  });

}


/* Change Quantity */

function changeQuantity(id, amount) {

  const item = cart.find(
    item => item.id === id
  );


  if (!item) return;


  item.qty += amount;


  if (item.qty < 1) {

    cart = cart.filter(
      item => item.id !== id
    );

  }


  saveCart();

  renderCart();

  updateCount();

}


/* Open Cart */

function openCart() {

  renderCart();

  $("#overlay").classList.add("show");

  $("#cartDrawer").classList.add("open");

}


/* Close Cart */

function closeCart() {

  $("#overlay").classList.remove("show");

  $("#cartDrawer").classList.remove("open");

}


/* Toast */

function toast(message) {

  const element = $("#toast");

  element.textContent = message;

  element.classList.add("show");


  setTimeout(() => {

    element.classList.remove("show");

  }, 2200);

}


/* Category Filters */

$$(".filter").forEach(button => {

  button.onclick = () => {

    $$(".filter").forEach(
      item =>
        item.classList.remove("active")
    );


    button.classList.add("active");


    const category =
      button.dataset.category;


    if (category === "All") {

      renderProducts(products);

    } else {

      renderProducts(
        products.filter(
          product =>
            product.cat === category
        )
      );

    }

  };

});


/* Category Cards */

$$(".cat").forEach(category => {

  category.onclick = () => {

    setTimeout(() => {

      const name =
        category.dataset.jump;


      const filter = $(
        `.filter[data-category="${name}"]`
      );


      if (filter) {

        filter.click();

      }

    }, 50);

  };

});


/* Cart Events */

$("#cartBtn").onclick = openCart;

$("#closeCart").onclick = closeCart;

$("#overlay").onclick = closeCart;


/* Search */

$("#searchBtn").onclick = () => {

  $("#searchModal").classList.add("open");

  $("#searchInput").focus();

};


$("#closeSearch").onclick = () => {

  $("#searchModal").classList.remove("open");

};


$("#searchInput").oninput = event => {

  const query =
    event.target.value.toLowerCase();


  const results = query
    ? products.filter(product =>
        (
          product.name +
          product.desc +
          product.cat
        )
        .toLowerCase()
        .includes(query)
      )
    : products.slice(0, 4);


  $("#searchResults").innerHTML =
    results.map(product => `

      <div class="search-result">

        <span>
          ${product.name}
        </span>

        <span>
          ${money(product.price)}
        </span>

      </div>

    `).join("");

};


/* Mobile Menu */

$("#menuBtn").onclick = () => {

  const nav = $(".nav");


  if (nav.style.display === "flex") {

    nav.style.display = "none";

    return;

  }


  nav.style.display = "flex";

  nav.style.position = "absolute";

  nav.style.top = "76px";

  nav.style.left = "0";

  nav.style.right = "0";

  nav.style.background = "var(--paper)";

  nav.style.padding = "25px 5vw";

  nav.style.flexDirection = "column";

  nav.style.borderBottom =
    "1px solid var(--line)";

};


/* Account */

$("#accountBtn").onclick = () => {

  toast(
    "Account area — connect your auth provider here"
  );

};


/* Checkout */

$("#checkoutBtn").onclick = () => {

  if (cart.length) {

    toast(
      "Checkout demo — connect Stripe or Razorpay"
    );

  } else {

    toast("Your bag is empty");

  }

};


/* Newsletter */

$("#newsletterForm").onsubmit = event => {

  event.preventDefault();


  $("#newsletterMsg").textContent =
    "You're on the list. Welcome to NOVA.";


  event.target.reset();

};


/* Initial Render */

renderProducts();

renderCart();

updateCount();