// recommendation
const { ipcRenderer } = require('electron');

ipcRenderer.on('recommendation-filters', async (event, filters) => {

    const { skin, type, budget } = filters;

    const response = await fetch(
        "https://makeup-api.herokuapp.com/api/v1/products.json"
    );

    let data = await response.json();

    // filter by product type (dropdown selection, optional)
    if (type) {
        data = data.filter(p =>
            p.product_type?.toLowerCase().includes(type.toLowerCase())
        );
    }

    // skin keywords (description + tag_list)
    const skinKeywords = {
        oily: {
            desc: [
                "matte", "oil-control", "shine-free", "long-lasting", "long wearing",
                "pore minimizing", "blurring", "lightweight", "non-greasy", "waterproof", "oil-free", "controls oil",
                "coverage", "transfer-free", "crease", "weightless", "soft-focus", "powder-based"
            ]
        },
        dry: {
            desc: [
                "hydrating", "moisturizing", "nourishing", "dewy", "smooth",
                "soft", "creamy", "luminous", "glow", "rich"
            ]
        },
        combination: {
            desc: [
                "balance", "matte", "hydrating", "lightweight", "smooth",
                "long-lasting", "glow"
            ]
        }
    };

    // filter by skin keywords (all product types allowed)
    if (skin && skinKeywords[skin]) {
        const keywords = skinKeywords[skin].desc;

        data = data.filter(p => {
            return keywords.some(keyword =>
                (p.description?.toLowerCase().includes(keyword)) ||
                (p.tag_list?.some(tag => tag.toLowerCase().includes(keyword)))
            );
        });
    }

    // ensure price is valid
    data = data.filter(p => p.price && !isNaN(parseFloat(p.price)));

    // budget filter
    if (budget === "low") {
        data = data.filter(p => parseFloat(p.price) < 10);
    } else if (budget === "mid") {
        data = data.filter(p => {
            const price = parseFloat(p.price);
            return price >= 10 && price <= 30;
        });
    } else if (budget === "high") {
        data = data.filter(p => parseFloat(p.price) > 30);
    }

    // display top 10 recommendations
    displayRecommendation(data.slice(0, 10));
});

// display recommended products
function displayRecommendation(products) {
    const container = document.getElementById("recommendationResult");

    container.innerHTML = `
        <h3 class="recommend-title">Top 10 Recommended For You 💖</h3>
        <div class="recommend-grid"></div>
    `;

    const grid = container.querySelector(".recommend-grid");

    if (!products || products.length === 0) {
        grid.innerHTML = "<p>No products found 😢</p>";
        return;
    }

    products.forEach(product => {
        const imgSrc = (product.image_link && product.image_link.toString().trim() !== "")
               ? product.image_link
               : "./image/default-pic.jpg";

        grid.innerHTML += `
            <div class="recommend-card-item">
                <img src="${imgSrc}" class="recommend-img"
                     onclick="viewProduct('${product.id}')" 
                     onerror="this.onerror=null; this.src='./image/default-pic.jpg';">
                <p class="recommend-name">${product.name}</p>
                <p class="recommend-price">$${product.price}</p>
            </div>
        `;
    });
}

function viewProduct(id) {
    window.location.href = `product.html?id=${id}`;
}

function home() {
    window.close ();
}

function wishlist() {
    window.location.href = "wishlist.html";
}

function cart() {
    window.location.href = "cart.html";
}

getRecommendation ();