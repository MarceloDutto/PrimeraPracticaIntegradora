const socket = io();

let productsContainer = document.querySelector("#products-container");
const prevButton = document.querySelector("#prevButton");
const nextButton = document.querySelector("#nextButton");
const btn_addToCart = document.querySelectorAll(".cartButton");

let products = [];
let prevPageLink = "";
let nextPageLink = "";

const getProducts = async (limit, page, query, sort) => {
    const url = `http://localhost:3000/api/products?limit=${limit}&page=${page}`;
    const headers = {
        'Content-type': 'application/json'
    }
    const method = 'GET';
    try {
        const response = await fetch(
            url,
            headers,
            method,
        );
        const data = response.json();
        return data
    } catch (error) {
        console.log(error)
    }
}

const updateProducts = async (limit, page, query, sort) => {    
    try {
        const response = await getProducts(limit, page, query, sort);
        products = response.payload;
        
        if(products.length === 0) {
            productsContainer.innerHTML = '';
            productsContainer.innerHTML = `<p class="error-text">¡Lo sentimos! Temporalmente no podemos mostrarte nuestros productos. Regresa más tarde. 😔</p>`;
        } else {
            
            productsContainer.innerHTML = '';
            products.forEach(product => {
                let productCard = document.createElement('div');
                productCard.classList.add("card");

                let cardContent = `
                <div class="product-image">
                <img src="${product.thumbnail}" alt="">
            </div>
            <div class="product-info">
                <p class="product-features"><strong>Nombre: ${product.name} </strong></p>
                <p class="product-features">Precio: ${product.price} </p>
            </div>
            <div class="actions">
                <a href="http://localhost:3000/products/details/${product._id}"><button class="action">Ver detalles</button></a> 
                <button class="cartButton" id="${product._id}">Agregar al carrito</button>
            </div>`

            productCard.innerHTML = cardContent;

            productsContainer.appendChild(productCard);
        });

        response.hasPrevPage? prevButton.setAttribute("href", `http://localhost:3000/realtimeproducts${response.prevLink}`) : prevButton.style.visibility = "hidden";
        response.hasNextPage? nextButton.setAttribute("href", `http://localhost:3000/realtimeproducts${response.nextLink}`) : nextButton.style.visibility = "hidden";
        }
    }catch (error) {
        console.log(error);
    }
}

socket.on('loadPage', async data => {
    const { limit, page, query, sort } = data;
    try {
        await updateProducts(limit, page, query, sort)
    } catch (error) {
        console.log(error);
    }
})







