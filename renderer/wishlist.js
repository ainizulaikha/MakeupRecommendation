// redirect to home
function home() {
    window.location.href = "index.html";
}

// redirect to cart page
function cart (){
    window.location.href = "cart.html";
}

// display list of wishlist
const container = document.getElementById("wishlist");

let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

if (wishlist.length === 0) {
    container.innerHTML = "<p>No items in wishlist yet.</p>";
} else {
    wishlist.forEach((product, index) => {

        const card = document.createElement("div");
        const imgSrc = (product.image_link && product.image_link.toString().trim() !== "")
               ? product.image_link
               : "./image/default-pic.jpg";

        card.innerHTML = `
            <img src="${imgSrc}" width="120" onerror="this.onerror=null; this.src='./image/default-pic.jpg';">
            <h3>${product.name}</h3>
            <p>Brand: ${product.brand || "N/A"}</p>
            <p>Price: $${product.price || "N/A"}</p>

            <button onclick="removeWishlist(${index})">✖️</button>
            <hr>
        `;

        container.appendChild(card);
    });
}

// remove item from wishlist
function removeWishlist(index) {
    wishlist.splice(index, 1);
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    location.reload();
}