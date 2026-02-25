// redirect to home
function home() {
    window.location.href = "index.html";
}

// display item in cart, total price
const container = document.getElementById("cart");
const totalDisplay = document.getElementById("totalPrice");

let cart = JSON.parse(localStorage.getItem("cart")) || [];

if (cart.length === 0) {
    container.innerHTML = "<p>Your cart is empty. Shop now</p>";
} else {

    let total = 0;

    cart.forEach((product, index) => {

        const price = parseFloat(product.price) || 0;
        total = total + price * product.quantity;

        const card = document.createElement("div");
        const imgSrc = (product.image_link && product.image_link.toString().trim() !== "")
               ? product.image_link
               : "./image/default-pic.jpg";

        card.innerHTML = `
            <img src="${imgSrc}" width="120" onerror="this.onerror=null; this.src='./image/default-pic.jpg';">
            <h3>${product.name}</h3>
            <p>Brand: ${product.brand || "N/A"}</p>
            <p>Price: $${price}</p>
            <p>Quantity: ${product.quantity}</p>

            <button onclick="addQuantity(${index})">➕</button>
            <button onclick="removeQuantity(${index})">➖</button>
            <button onclick="removeCart(${index})">✖️</button>
            <hr>
        `;

        container.appendChild(card);
    });

    totalDisplay.innerText = "Total: $" + total.toFixed(2);
}

// remove item from cart
function removeCart(index) {
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    location.reload();
}

// add new quantity
function addQuantity(index) {
    cart[index].quantity += 1;
    localStorage.setItem("cart", JSON.stringify(cart));
    location.reload();
}

// tolak from quantity
function removeQuantity(index) {
    if (cart[index].quantity > 1) {
        cart[index].quantity -= 1;
    } else {
        cart.splice(index, 1);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    location.reload();
}

// redirect to wishlist page
function wishlist (){
    window.location.href = "wishlist.html";
}