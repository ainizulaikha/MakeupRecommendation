const product = new URLSearchParams(window.location.search);
const productType = product.get("type"); 

// update page title
const title = document.getElementById("categoryTitle");
title.textContent = `All ${productType} Products 🔖`;

let productData = [];

// load products from API
async function loadProducts() {
    try {
        const productList = document.getElementById ("productList");
        productList.innerHTML = "<p>Loading products...</p>";
        const response = await fetch(
            `https://makeup-api.herokuapp.com/api/v1/products.json?product_type=${productType}`
        );

        const data = await response.json();

        productData = data;

        loadBrands ();
        displayProduct(data);

    } catch (error) {
        console.error("Error loading products:", error);

        const productList = document.getElementById("productList");
        productList.innerHTML = "<p>Failed to load products.</p>";
    }
}

// display products
function displayProduct(products, sortOption = null) {

    const productList = document.getElementById("productList");
    productList.innerHTML = "";

    products.forEach((product, index) => {

        const card = document.createElement("div");
        const imgSrc = (product.image_link && product.image_link.toString().trim() !== "")
               ? product.image_link
               : "./image/default-pic.jpg";

        let badge = "";

        // Top 10 cheapest
        if (sortOption === "low" && index < 10) {
            badge = "⭐ Top Budget Pick";
            card.style.border = "2px solid green";
        }

        // Top 10 most expensive
        if (sortOption === "high" && index < 10) {
            badge = "💎 Top Luxury Pick";
            card.style.border = "2px solid purple";
        }

        card.innerHTML = `
            ${badge ? `<p><strong>${badge}</strong></p>` : ""}
            <img src="${imgSrc}" class="recommend-img" width="120" 
            onclick="viewProduct('${product.id}')"
            style="cursor:pointer;" onerror="this.onerror=null; this.src='./image/default-pic.jpg';"> 
            <h3>${product.name}</h3>
            <p>Brand: ${product.brand || "N/A"}</p>
            <p>Price: ${product.price || "N/A"}</p>
            <p>Claims: ${product.tag_list?.join(", ") || "No available information"}</p>

            <button onclick="addToWishlist(${index})">Add to Wishlist 🩷</button>
            <button onclick="addToCart(${index})">Add to Cart 🛒</button>
            <hr>
        `;

        productList.appendChild(card);
    });
}

// redirect to home
function home() {
    window.location.href = "index.html";
}

// redirect to wishlist page
function wishlist (){
    window.location.href = "wishlist.html";
}

// redirect to cart page
function cart (){
    window.location.href = "cart.html";
}

// add to wishlist
function addToWishlist(index) {
    const product = productData[index];

    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    wishlist.push(product);
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    
    alert("Added to Wishlist 🩷");
}

// add to cart
function addToCart(index) {
    const product = productData[index];

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingProduct = cart.find(item => item.id === product.id);

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        product.quantity = 1;
        cart.push(product);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Added to Cart 🛒");
}

// redirect to wishlist page
function wishlist (){
    window.location.href = "wishlist.html";
}

// view product details
function viewProduct(id) {
    window.location.href = `product.html?id=${id}`;
}

// filter brand
function loadBrands() {

    const brandSet = new Set(productData.map(p => p.brand).filter(Boolean));
    const brandFilter = document.getElementById("brandFilter");

    brandFilter.innerHTML = `<option value="">All Brands</option>`;

    brandSet.forEach(brand => {
        brandFilter.innerHTML += `<option value="${brand}">${brand}</option>`;
    });
}

// update after filter and sort
function updateProducts() {

    const priceOption = document.getElementById("priceFilter")?.value;
    const brandOption = document.getElementById("brandFilter")?.value;
    const sortOption = document.getElementById("sortOption")?.value;

    let updated = [...productData];

    // remove product with no price
    updated = updated.filter(p => p.price);

    // price filter
    if (priceOption === "low") {
        updated = updated.filter(p => parseFloat(p.price) < 10);
    }

    if (priceOption === "mid") {
        updated = updated.filter(p => {
            const price = parseFloat(p.price);
            return price >= 10 && price <= 30;
        });
    }

    if (priceOption === "high") {
        updated = updated.filter(p => parseFloat(p.price) > 30);
    }

    // brand filter
    if (brandOption) {
        updated = updated.filter(p =>
            p.brand?.toLowerCase() === brandOption.toLowerCase()
        );
    }

    // sort products
    if (sortOption === "low") {
        updated.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    }

    if (sortOption === "high") {
        updated.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    }

    displayProduct(updated, sortOption);
}

// start
loadProducts ();