const goToCartButton = document.querySelector("#goToCartButton")
const prevButton = document.querySelector("#prevButton");
const nextButton = document.querySelector("#nextButton");
const btn_addToCart = document.querySelectorAll(".cartButton");

let cartId;

const createCart = async () => {
    try {
        await fetch(`http://localhost:3000/api/carts`, {method: "post"});
        const response = await fetch(`http://localhost:3000/api/carts`, {method: "get"});
        const data = await response.json();
        const lastElement = await data[data.length - 1];
        cartId = lastElement._id
        goToCartButton.setAttribute("href", `http://localhost:3000/carts/${cartId}`)
    } catch (error) {
        console.log(error);
    }
}

createCart()

if(prevButton.getAttribute("href") === "") prevButton.style.visibility = "hidden";
if(nextButton.getAttribute("href") === "") nextButton.style.visibility = "hidden";



btn_addToCart.forEach(btn => {
    btn.addEventListener('click', e => {
        e.preventDefault();
        const eventId = btn.getAttribute("id");
        addToCart(eventId)
    })
})

const addToCart = async (pid) => {
    try {
        await fetch(`http://localhost:3000/api/carts/${cartId}/product/${pid}`, {method: "post"});
    } catch (error) {
        console.log(error);
    }
}   