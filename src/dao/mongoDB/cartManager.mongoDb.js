import Cart from "./models/carts.models.js";
import ProductManager from "./productManager.MongoDb.js"

const pm = new ProductManager();

class CartManager {
    
    getCarts = async () => {
        try {
            const carts = Cart.find();
            return carts;
        } catch (error) {
            console.log(error);
        }
    }

    getCartById = async (idRef) => {
        try {
            const cartById = Cart.findOne({_id: idRef});
            return cartById ? cartById : {};
        } catch (error) {
            console.log(error);
        }
    }

    addCart = async () => {
        try {
            Cart.create({products: []});
            return 'Carrito creado';
        } catch (error) {
            console.log(error);
        }
    }
}

export default CartManager;