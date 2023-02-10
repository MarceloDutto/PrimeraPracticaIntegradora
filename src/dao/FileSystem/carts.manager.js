import fs, { existsSync, writeFile, promises } from 'fs';
import { v4 as uuidv4 } from 'uuid';
import __dirname from '../../utils.js';
import ProductManager from './products.manager.js';

const productsPath = __dirname + '/files/products.json';
const pm = new ProductManager(productsPath);


class CartsManager {
    constructor(path) {
        this.carts = [];
        this.path = path;
    }

    getCarts = async () => {
        if(!existsSync(this.path)) return [];

        try {
            const data = await promises.readFile(this.path, 'utf-8');
            this.carts = JSON.parse(data);
            return this.carts;
        } catch (error) {
            console.log(error)
        }
    }

    getCartById = async(idRef) => {
        if(!existsSync(this.path)) return {};

        await this.getCarts();

        try {
            const cartById = this.carts.find(cart => cart.id === idRef);
            return cartById ? cartById : {};
        } catch (error) {
            console.log(error);
        }
    }

    addCart = async () => {
        existsSync(this.path) ? await this.getCarts() : this.carts = [];

        let id;
        let uniqueId = false;
        while (uniqueId === false) {
            id = uuidv4();
            uniqueId = this.carts.forEach(cart => cart.id === id) ? false : true;
        };

        const cart = {
            id,
            products: []
        };

        this.carts.push(cart);

        const cartStr = JSON.stringify(this.carts, null, 2);
        writeFile(this.path, cartStr, error => {
            if(error) {
                throw error;
            }
        })

        return 'Carrito creado';
    }

    addProductToCart = async (cidRef, pidRef) => {
        let products = [];
        existsSync(this.path) ? await this.getCarts() : this.carts = [];

        const cartIndex = this.carts.findIndex(cart => cart.id === cidRef);
        if(cartIndex === -1) return 'No se encontró el carrito';

        try {
            products = await pm.getProducts();
        } catch (error) {
            console.log(error);
            return 'Error al acceder a los productos';
        }

        const selectedProduct = products.find(prod => prod.id === pidRef);
        if(selectedProduct === undefined) return 'No se encontró el producto';

        const productIndex = this.carts[cartIndex].products.findIndex(prod => prod.id === selectedProduct.id);

        if(productIndex !== -1) {
            this.carts[cartIndex].products[productIndex].quantity ++;
            const cartStr = JSON.stringify(this.carts, null, 2);
            writeFile(this.path, cartStr, error => {
                if(error) {
                    throw error;
                }
            })
            return 'Producto actualizado';
        } else {
            const cartProduct = {
                id: selectedProduct.id,
                quantity: 1
            }
            this.carts[cartIndex].products.push(cartProduct);
            const cartStr = JSON.stringify(this.carts, null, 2);
            writeFile(this.path, cartStr, error => {
                if(error) {
                    throw error;
                }
            })
            return 'Producto agregado al carrito con exito';
        }
    }
}

export default CartsManager;