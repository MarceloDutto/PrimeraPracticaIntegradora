const socket = io();

const renderProducts = (data) => {
    let productsContainer = document.querySelector("#products-container");
    productsContainer.innerHTML = '';
    
    if(data.length === 0) {
        productsContainer.innerHTML = '<p class="error-text">¡Lo sentimos! Temporalmente no podemos mostrarte nuestros productos. Regresa más tarde. 😔</p>'
    } else {
        data.forEach(product => {
            const { name, description, category, price, thumbnail, stock} = product;
            let productDiv = document.createElement('div');
            productDiv.classList.add("card"); 
            
            let divContent = `
            <div class="product-image">
                <img src="${thumbnail}" alt="imagen de producto">
            </div>
            <div class="product-info">
                <p class="product-features">Nombre: ${name}</p>
                <p class="product-features">Características: ${description}</p>
                <p class="product-features">Categoría: ${category}</p>
                <p class="product-features">Precio: ${price}</p>
                <p class="product-features">Disponible: ${stock} unidades</p>
            </div>`
    
            productDiv.innerHTML = divContent;
    
            productsContainer.appendChild(productDiv);
        });
    }
}


socket.on('newProduct', data => {
    renderProducts(data);
})


socket.on('productDeleted', data => {
    renderProducts(data);
})