import { Router } from 'express';
import __dirname from '../utils.js';
/* import CartsManager from '../dao/FileSystem/cartManager.fileSystem.js'; */  // <= File system
import CartManager from '../dao/mongoDB/cartManager.mongoDb.js';

/* const path = __dirname + '/files/carts.json'; */ // <= File system

/* const cm = new CartsManager(path); */ // <= File system
const cm = new CartManager();

const router = Router();

router.get('/', async (req, res) => {
    try {
        const carts = await cm.getCarts();
        res.json(carts);
    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'Error al acceder a los carritos'});
    }
})

router.get('/:cid', async (req, res) => {
    const { cid } = req.params;

    try {
        const cartById = await cm.getCartById(cid);
        if(Object.keys(cartById).length === 0) return res.status(404).json({message: 'Carrito no encontrado'});
        const productsInCart = cartById.products;
        res.json(productsInCart);
    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'Error al acceder al carrito'});
    }
    
})

router.post('/', async (req, res) => {
    try {   
        const response = await cm.addCart();
        res.status(201).json({message: response});
    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'Error al crear el carrito'});
    }
})

/* router.post('/:cid/product/:pid', async (req, res) => {  // <= File system
    const { cid, pid } = req.params;

    try {
        const response = await cm.addProductToCart(cid, pid);
        res.json({message: response});
    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'Error al agregar el producto al carrito'});
    }
} ) */

export default router;