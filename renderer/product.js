const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

async function loadProduct () {
    try {
        const response = await fetch(
            `https://makeup-api.herokuapp.com/api/v1/products/${productId}.json`
        );

        const product = await response.json();

        displayProduct (product);

    } catch (error) {
        console.error("Error loading product:", error);
    }
}

// display product 
function displayProduct (product) {

    const container = document.getElementById ("productDetail");
    const imgSrc = (product.image_link && product.image_link.toString().trim() !== "")
               ? product.image_link
               : "./image/default-pic.jpg";

    container.innerHTML = `
        <img src="${imgSrc}" width="200" onerror="this.onerror=null; this.src='./image/default-pic.jpg';">
        <h2>${product.name}</h2>
        <p><strong>Brand:</strong> ${product.brand || "N/A"}</p>
        <p><strong>Price:</strong> ${product.price || "N/A"}</p>
        <p><strong>Description:</strong> ${product.description || "No description available."}</p>
        <p>Claims: ${product.tag_list?.join(", ") || "No available information"}</p>

        <button onclick="addToWishlist ()">Add to Wishlist 🩷</button>
        <button onclick="addToCart ()">Add to Cart 🛒</button>
    `;

    window.currentProduct = product; // store globally
}

// add to wishlist
function addToWishlist () {
    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    wishlist.push(window.currentProduct);
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    alert("Added to Wishlist 🩷");
}

// add to cart
function addToCart () {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existing = cart.find(item => item.id === window.currentProduct.id);

    if (existing) {
        existing.quantity += 1;
    } else {
        window.currentProduct.quantity = 1;
        cart.push(window.currentProduct);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Added to Cart 🛒");
}

// go back
function back () {
    window.history.back();
}

// redirect to wishlist page
function wishlist (){
    window.location.href = "wishlist.html";
}

// redirect to cart page
function cart (){
    window.location.href = "cart.html";
}

loadProduct();