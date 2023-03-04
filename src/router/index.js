import products from "../products/controller.products.js";
import carts from "../carts/controller.carts.js";
import views from "../views/controller.views.js";
import usersController from "../users/controller.users.js";
import authController from "../auth/controller.auth.js";

const router = (app) => {
    app.use('/api/products', products);
    app.use('/api/carts', carts);
    app.use('/api/users', usersController);
    app.use('/api/auth', authController);
    app.use('/', views);
}

export default router;