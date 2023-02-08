import products from "../products/controller.products.js";
import carts from "../carts/controller.carts.js";
import chat from "../chat/controller.chat.js";


const router = (app) => {
    app.use('/api/products', products);
    app.use('/api/carts', carts);
    app.use('/chat', chat);
}

export default router;