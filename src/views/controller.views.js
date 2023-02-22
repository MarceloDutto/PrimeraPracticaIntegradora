import { Router } from "express";
import io from '../app.js'
import ChatManager from "../dao/mongoDB/chatManager.mongoDb.js";
import ProductManager from "../dao/mongoDB/productManager.MongoDb.js";
import CartManager from "../dao/mongoDB/cartManager.mongoDb.js";

const pm = new ProductManager();
const cm = new CartManager();
const chm = new ChatManager();
const router = Router()

router.get('/products', async (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page)  || 1; 
    const query = req.query.query || null;
    const sort = req.query.sort || null;
    let showProducts = false;
    let products = [] 

    try {
        const response = await pm.getProducts(limit, page, query, sort);
        products = response.payload.docs;

        products.length > 0 ? showProducts = true : showProducts = false;
        res.render('products.handlebars', {
            showProducts,
            products: products.map(prod => prod.toJSON()),
            prevPageLink: response.hasPrevPage? response.prevLink : "",
            nextPageLink: response.hasNextPage? response.nextLink : "",
            style: 'products.css'
        });
    } catch (error) {
        console.log(error)
        res.status(500).render('products.handlebars', {
            showProducts,
            style: 'products.css'
        });
    }
})

router.get('/products/details/:pid', async (req, res) => {
    const { pid } = req.params;
    let showProduct = false;
    let product = {}

    try {
        product = await pm.getProductById(pid);
        product === {} ? showProduct = false : showProduct = true
        const { thumbnail, name, description, category, price, stock } = product;

        res.render('details.handlebars', {
            showProduct,
            thumbnail,
            name,
            description,
            category,
            price,
            stock,
            style: 'details.css'
        })

    } catch (error) {
        console.log(error);
        res.status(500).render('details.handlebars', {
            showProduct,
            style: 'details.css'
        })
    }
} )

router.get('/realtimeproducts', async (req, res) => {
    
    io.on('connection', socket => {
        console.log(`New client connected with id ${socket.id}`);  
    })
    
    try {
        let showProducts = false;
        let products = [] 
        products = await pm.getProducts();
        products.length > 0 ? showProducts = true : showProducts = false;
        res.render('realTimeProducts.handlebars', {
            showProducts,
            products,
            style: 'products.css'
        });
    } catch (error) {
        console.log(error);
        res.status(500).render('realTimeProducts.handlebars', {
            showProducts,
            style: 'products.css'
            })
    }
})

router.get ('/carts/:cid', async (req, res) => {
    const { cid } = req.params;
    let showProducts = false;

    try {
        const cart = await cm.getCartById(cid);
        const products = cart.products;
        products.length > 0 ? showProducts = true : showProducts = false;
    
        res.render('cart.handlebars', {
            showProducts,
            products: products.map(prod => prod.toJSON()),
            style: 'cart.css'
        }) 
    } catch (error) {
        console.log(error) 
        res.status(500).render('cart.handlebars', {
            showProducts,
            style: 'cart.css'
        })
    }
})

router.get('/chat', (req, res) => {
    res.render('chat.handlebars', {
        style: 'chat.css'
    });
})

//dev
router.delete('/chat', async (req, res) => {
    try {
        await chm.deleteAllMessages();
        res.json({message: 'Mensajes eliminados'});
    } catch (error) {
        console.log(error);
    }
})

export default router;