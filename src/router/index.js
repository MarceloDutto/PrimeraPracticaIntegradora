import products from "../products/controller.products.js";
import carts from "../carts/controller.carts.js";
import views from "../views/controller.views.js";

const router = (app) => {
    app.use('/api/products', products);
    app.use('/api/carts', carts);
    app.use('/', views);
}

export default router;