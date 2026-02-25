const { ipcRenderer } = require('electron');

// redirect to wishlist page
function wishlist (){
    window.location.href = "wishlist.html";
}

// redirect to cart page
function cart (){
    window.location.href = "cart.html";
}

// search input
function searchProduct () {
    const keyword = document.getElementById("searchInput").value;

    if (!keyword) {
        alert("Please enter a search keyword.");
        return;
    }

    window.location.href = `search.html?query=${keyword}`;
}

function sortProduct (){
    console.log (`Sorting by price ...`);
}

function filterProduct (){
    console.log (`Filtering by type ...`);
}

// redirect to category.html based on chosen category
function viewCategory (category){
    window.location.href = `category.html?type=${category}`;
}

// get value, redirect to recommendation page
function getRecommendation () {
  const skin = document.getElementById("skinType").value;
  const type = document.getElementById("productTypeSelect").value;
  const budget = document.getElementById("budgetSelect").value;

  ipcRenderer.send('open-recommendation-window', {
    skin,
    type,
    budget
  });
}