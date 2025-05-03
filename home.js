  if (!localStorage.getItem("loggedInUser")) {
    window.location.href = "index.html";
  }

  fetchProducts();
  

  let allProducts = [];

  // Pagination 
  let currentList = [];
  let currentPage = 1;
  const itemsPerPage = 5;
  // Pagination 

  function getInitials(username) {
    console.log(username.split(" "))
    return username                       
      .split(" ")                    
      .map(word => word[0])           
      .join('')                       
      .toUpperCase();                 
  }

  let nameletter = localStorage.getItem("loggedInUser");
  let username = getInitials(nameletter);
  console.log(username);

  let u = document.querySelector(".user-name-letter");
  u.textContent = `${username}`;


  async function fetchProducts() {
    const res = await fetch("https://fakestoreapi.com/products");
    const data = await res.json();
    allProducts = data;
    console.log(data)
    displayProducts(data);

    // Pagination
    currentList = allProducts;
    displayPaginated(currentPage);
    // Pagination

    fetch("https://fakestoreapi.com/products/categories")
    .then(res => res.json())
    .then(categories => {
      const select = document.getElementById("categorySelect");
      categories.forEach(cat => {
        const option = document.createElement("option");
        option.value = cat;
        option.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
        select.appendChild(option);
      });
    });
  }
  
  function displayProducts(products) {
    const container = document.getElementById("productList");
    container.innerHTML = "";

    products.forEach(product => {
      console.log(product)
      const card = document.createElement("div");
      card.className = "product-card";
      card.innerHTML = `
      <img src="${product.image}" alt="${product.title}"/>
      <h4>${product.title}</h4>
      <p>$${product.price}</p>
      <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
      <a href="product.html?id=${product.id}" class="view-details">View Details</a>
    `;
      container.appendChild(card);
      document.addEventListener("click", (e) => {
        if(e.target.classList.contains("view-details"))
        window.location.href = `product.html?id=${product.id}`;
      });
    });
  }

  // cart 
  const cartIcon = document.querySelector(".cart-icon");
  const miniCart = document.querySelector(".mini-cart");

  cartIcon.addEventListener("click" , (e) => {
    updateMiniCart()
    miniCart.classList.toggle("mini-cart-visible");
  });


  // event delegation concept
  document.addEventListener("click", function (e) {
    if (e.target.classList.contains("add-to-cart")) {
      const id = +e.target.getAttribute("data-id");
      console.log(id)
      const product = allProducts.find(p => p.id === id);
      addToCart(product);
    }
  
    if (e.target.classList.contains("decrease-qty")) {
      const id = +e.target.getAttribute("data-id");
      decreaseQty(id);
    }
  
    if (e.target.classList.contains("increase-qty")) {
      const id = +e.target.getAttribute("data-id");
      increaseQty(id);
    }
  });
  // event delegation concept
  

function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const existing = cart.find(item => item.id === product.id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id: product.id , title: product.title , price : product.price , qty: 1 });
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  updateMiniCart();
}

function decreaseQty(id) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const index = cart.findIndex(item => item.id === id);
  if (index !== -1) {
    if (cart[index].qty > 1) {
      cart[index].qty -= 1;
    } else {
      cart.splice(index, 1); // remove item
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    updateMiniCart();
  }
}

function increaseQty(id) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const item = cart.find(i => i.id === id);
  if (item) {
    item.qty += 1;
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    updateMiniCart();
  }
}

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const total = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cart.reduce((sum , item) => sum + item.price*item.qty , 0);
  console.log(totalPrice)
  document.querySelector(".total-price").textContent = `total price : $${Math.floor(totalPrice)}`;
  document.getElementById("cartCount").textContent = total;
}

function updateMiniCart() {
  const miniCart = document.getElementById("miniCart");
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    miniCart.innerHTML = "<p>No items in cart.</p>";
    return;
  }

  miniCart.innerHTML = "";
  cart.forEach(item => {
    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <span>${item.title}</span>
      <div>
        <button class="decrease-qty" data-id="${item.id}">-</button>
        <button class="increase-qty" data-id="${item.id}">+</button>
        <span>${item.qty}</span>
      </div>
    `;
    miniCart.appendChild(div);
  });
}

  const searchBtn = document.getElementById("searchBtn")
  searchBtn.addEventListener("click", () => {
    const q = document.getElementById("searchInput").value.toLowerCase();
    currentList = allProducts.filter(p => p.title.toLowerCase().includes(q));
    displayPaginated(1);
  });


  function logout() {
    localStorage.removeItem("loggedInUser");
    window.location.href = "index.html";
  }
  
  updateCartCount();



  // side bar

  const sidebar = document.querySelector(".sidebar");
  const hamburger = document.querySelector(".hamburger");
  const closesidebar = document.querySelector("#closeSidebar");

  hamburger.addEventListener("click" , (e) => {
    sidebar.classList.add("active");
  });

  closesidebar.addEventListener("click" , (e) => {
    sidebar.classList.remove("active");
  });

  const applyFilters = document.getElementById("applyFilters");

  applyFilters.addEventListener("click", (e) => {
    const min = parseFloat(document.getElementById("minPrice").value) || 0;
    const max = parseFloat(document.getElementById("maxPrice").value) || Infinity;
    const category = document.getElementById("categorySelect").value;
  
    currentList = allProducts.filter(p => p.price >= min && p.price <= max);
    if (category) currentList = currentList.filter(p => p.category === category);
  
    displayPaginated(1); // by default first page that's why 1 is passed in parameter
  });
  
  

  // Pagination 

  function displayPaginated(page = 1) {
    currentPage = page;
  
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const visibleItems = currentList.slice(start, end);
  
    displayProducts(visibleItems); // this just shows UI
    renderPagination(currentList.length);
  }


// pages ke number dikhane ke liyee  < 1   2   3  ....  >

  function renderPagination(totalItems) {
    const container = document.getElementById("pagination");
    container.innerHTML = "";
  
    const totalPages = Math.ceil(totalItems / itemsPerPage);
  
    // Previous Button
    const prevBtn = document.createElement("button");
    prevBtn.textContent = "Previous";
    prevBtn.disabled = currentPage === 1;
    prevBtn.addEventListener("click", () => displayPaginated(currentPage - 1));
    container.appendChild(prevBtn);
  
    // Page Numbers
    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement("button");
      btn.textContent = i;
      if (i === currentPage) btn.classList.add("active");
  
      btn.addEventListener("click", () => displayPaginated(i));
      container.appendChild(btn);
    }
  
    // Next Button
    const nextBtn = document.createElement("button");
    nextBtn.textContent = "Next";
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.addEventListener("click", () => displayPaginated(currentPage + 1));
    container.appendChild(nextBtn);
  }
  
  