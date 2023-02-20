import { Router } from "express";
import io from '../app.js'
import ChatManager from "../dao/mongoDB/chatManager.mongoDb.js";
import ProductManager from "../dao/mongoDB/productManager.MongoDb.js";
import { uploader } from "../utils.js";

const pm = new ProductManager();
const chm = new ChatManager();
const router = Router()

router.get('/home', async (req, res) => {
    let showProducts = false;
    let products = [] 
    try {
        products = await pm.getProducts();
        products.length > 0 ? showProducts = true : showProducts = false;
        res.render('home.handlebars', {
            showProducts,
            products,
            style: 'home.css'
        });
    } catch (error) {
        console.log(error)
        res.status(500).render('home.handlebars', {
            showProducts,
            style: 'home.css'
        });
    }
})

router.get('/realtimeproducts', async (req, res) => {
    
    io.on('connection', socket => {
        console.log(`New client connected with id ${socket.id}`);  
    })
    
    try {
        let showProducts = false;
        let products = [] 
        products = await pm.getProducts();
        products.length > 0 ? showProducts = true : showProducts = false;
        res.render('home.handlebars', {
            showProducts,
            products,
            style: 'home.css'
        });
    } catch (error) {
        console.log(error);
        res.status(500).render('realTimeProducts.handlebars', {
            showProducts,
            style: 'home.css'
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