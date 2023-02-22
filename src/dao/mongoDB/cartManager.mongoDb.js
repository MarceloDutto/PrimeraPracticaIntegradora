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
            return {message: 'Carrito creado'};
        } catch (error) {
            console.log(error);
        }
    }

    addProductToCart = async (cidRef, pidRef) => {
        try {
            const cart = await this.getCartById(cidRef);
            if(!cart) return 'No se encontró el carrito';
            const product = await pm.getProductById(pidRef);
            if(!product) return 'No se encontró el producto';

            const prodIndex = cart.products.findIndex(prod => prod.product.equals(product._id));
            
            if(prodIndex !== -1) {
                cart.products[prodIndex].quantity ++;
                await Cart.updateOne({_id: cidRef}, cart);
                return 'Producto actualizado';
            } else {
                cart.products.push({product: pidRef, quantity: 1});
                await Cart.updateOne({_id: cidRef}, cart);
                return 'Producto agregado al carrito';
            }
        } catch (error) {
            console.log(error);
        }
    }

    updateProductsfromCart = async (cidRef, update) => {
        try {
            const cart = await this.getCartById(cidRef);
            if(!cart) return 'No se encontró el carrito';

            cart.products = update;
            await Cart.updateOne({_id: cidRef}, cart);
            return 'Productos actualizados';
        } catch (error) {
            console.log(error);
        }
    }

    updateQuantity = async (cidRef, pidRef, update) => {
        try {
            const cart = await this.getCartById(cidRef);
            if(!cart) return 'No se encontró el carrito';

            if(cart.products.length === 0) return 'El carrito no tiene productos';

            const prodIndex = cart.products.findIndex(prod => prod.product.equals(pidRef));
            if(prodIndex === -1) return 'El producto no se encontró en el carrito';

            cart.products[prodIndex].quantity = update;
            await Cart.updateOne({_id: cidRef}, cart);
            return 'Producto actualizado';
        } catch (error) {
            console.log(error);
        }
    }

    deleteProductfromCart = async (cidRef, pidRef) => {
        try {
            const cart = await this.getCartById(cidRef);
            if(!cart) return 'No se encontró el carrito';

            if(cart.products.length === 0) return 'El carrito no tiene productos';

            const prodIndex = cart.products.findIndex(prod => prod.product.equals(pidRef));
            if(prodIndex === -1) return 'El producto no se encontró en el carrito';

            cart.products.splice(prodIndex, 1);
            await Cart.updateOne({_id: cidRef}, cart);
            return 'Producto eliminado del carrito'
        } catch (error) {
            console.log(error);
        }
    }

    deleteProductsfromCart = async (cidRef) => {
        try {
            const cart = await this.getCartById(cidRef);
            if(!cart) return 'No se encontró el carrito';

            if(cart.products.length === 0) return 'El carrito no tiene productos';

            cart.products = [];
            await Cart.updateOne({_id: cidRef}, cart);
            return 'Productos eliminados del carrito'
        } catch (error) {
            console.log(error);
        }
    }
}

export default CartManager;