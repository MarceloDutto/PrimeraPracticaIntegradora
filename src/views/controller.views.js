import { Router } from "express";
import { io } from '../app.js'
import ChatManager from "../dao/mongoDB/chatManager.mongoDb.js";
import ProductManager from "../dao/mongoDB/productManager.MongoDb.js";
import CartManager from "../dao/mongoDB/cartManager.mongoDb.js";
import { privateAccess, publicAccess }  from '../middlewares/index.js'

const pm = new ProductManager();
const cm = new CartManager();
const chm = new ChatManager();
const router = Router()

router.get('/', publicAccess, (req, res) => {
    res.redirect('/products')
})

router.get('/signup', publicAccess, (req, res) => {
    res.render('signup.handlebars', {
        style: 'signup.css'
    })
})

router.get('/login', publicAccess, (req, res) => {
    res.render('login.handlebars', {
        style: 'login.css'
    })
})

router.get('/profile', privateAccess, (req, res) => {
    const { user } = req.session;
    res.render('profile.handlebars', {
        user,
        style: 'profile.css'
    })
})

router.get('/products', privateAccess, async (req, res) => {
    const { user } = req.session;
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page)  || 1; 
    const query = req.query.query || null;
    const sort = req.query.sort || null;
    let showProducts = false;
    let products = [] 

    try {
        const response = await pm.getProducts(limit, page, query, sort);
        products = response.payload;

        products.length > 0 ? showProducts = true : showProducts = false;
        res.render('products.handlebars', {
            user,
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

router.get('/products/details/:pid', privateAccess, async (req, res) => {
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
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page)  || 1; 
    const query = req.query.query || null;
    const sort = req.query.sort || null;
    const data = {
        limit,
        page,
        query,
        sort
    }
    
    io.on('connection', socket => {
        console.log(`New client connected with id ${socket.id}`);
        
        socket.emit('loadPage', data);
    
    });
    
    res.render('realTimeProducts.handlebars', {
        style: 'products.css'
    })

   /*  try {
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
    } */
})

router.get ('/carts/:cid', privateAccess, async (req, res) => {
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

router.get('/chat', privateAccess, (req, res) => {
    res.render('chat.handlebars', {
        style: 'chat.css'
    });
})

//dev
router.delete('/chat', privateAccess, async (req, res) => {
    try {
        await chm.deleteAllMessages();
        res.json({message: 'Mensajes eliminados'});
    } catch (error) {
        console.log(error);
    }
})

export default router;