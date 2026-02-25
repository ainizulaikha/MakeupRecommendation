const search = new URLSearchParams(window.location.search);
const searchName = search.get("query");

const title = document.getElementById ("searchTitle");
title.textContent = `Search Results for "${searchName}" 🔎`;

let productData = [];

async function searchResults () {

    if (!searchName) {
        title.textContent = "No search keyword provided.";
        return;
    }

    const container = document.getElementById ("searchResult");
    container.innerHTML = "<p>Loading...</p>";

    try {

        let data = [];

        // search by brand 
        const brandResponse = await fetch(
            `https://makeup-api.herokuapp.com/api/v1/products.json?brand=${searchName}`
        );

        data = await brandResponse.json();

        // search by product type
        if (data.length === 0) {
            const typeResponse = await fetch(
                `https://makeup-api.herokuapp.com/api/v1/products.json?product_type=${searchName}`
            );

            data = await typeResponse.json();
        }

        // search by product name
        if (data.length === 0) {
            const allResponse = await fetch(
                `https://makeup-api.herokuapp.com/api/v1/products.json`
            );

            const allProducts = await allResponse.json();

            data = allProducts.filter(product =>
                product.name?.toLowerCase().includes(searchName.toLowerCase())
            );
        }

        productData = data;
        loadBrands ();
        displayProducts (data);

    } catch (error) {
        container.innerHTML = "<p>Search failed. Please try again.</p>";
        console.error("Search error:", error);
    }
}

// display product
function displayProducts (products, sortOption = null) {

    const container = document.getElementById("searchResult");
    container.innerHTML = "";

    if (products.length === 0) {
        container.innerHTML = "<p>No matching products found.</p>";
        return;
    }

    products.forEach ((product, index) => {

        const card = document.createElement("div");
        const imgSrc = (product.image_link && product.image_link.toString().trim() !== "")
               ? product.image_link
               : "./image/default-pic.jpg";
        let badge = "";

        // Top 10 Cheapest
        if (sortOption === "low" && index < 10) {
            badge = "⭐ Top Budget Pick";
            card.style.border = "2px solid green";
        }

        // Top 10 Most Expensive
        if (sortOption === "high" && index < 10) {
            badge = "💎 Top Luxury Pick";
            card.style.border = "2px solid purple";
        }

        card.innerHTML = `
            ${badge ? `<p><strong>${badge}</strong></p>` : ""}
            <img src="${imgSrc}" width="120" 
            onclick="viewProduct('${product.id}')"
            style="cursor:pointer;" onerror="this.onerror=null; this.src='./image/default-pic.jpg';">
            <h3>${product.name}</h3>
            <p>Brand: ${product.brand || "N/A"}</p>
            <p>Price: ${product.price || "N/A"}</p>

            <button onclick="addToWishlist(${index})">Add to Wishlist 🩷</button>
            <button onclick="addToCart(${index})">Add to Cart 🛒</button>
            <hr>
        `;

        container.appendChild (card);
    });
}

// redirect to home
function home () {
    window.location.href = "index.html";
}

// add to wishlist
function addToWishlist (index) {
    const product = productData[index];
    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    wishlist.push(product);
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    alert("Added to Wishlist 🩷");
}

// add to cart
function addToCart (index) {
    const product = productData[index];
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existing = cart.find(item => item.id === product.id);

    if (existing) {
        existing.quantity += 1;
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

// redirect to cart page
function cart (){
    window.location.href = "cart.html";
}

// view product details
function viewProduct (id) {
    window.location.href = `product.html?id=${id}`;
}

// filter brand
function loadBrands () {
    const brandSet = new Set(productData.map(p => p.brand).filter(Boolean));
    const brandFilter = document.getElementById("brandFilter");

    brandFilter.innerHTML = `<option value="">All Brands</option>`;

    brandSet.forEach(brand => {
        brandFilter.innerHTML += `<option value="${brand}">${brand}</option>`;
    });
}

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
searchResults();