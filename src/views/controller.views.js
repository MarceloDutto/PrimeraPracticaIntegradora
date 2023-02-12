import { Router } from "express";
import ChatManager from "../dao/mongoDB/chatManager.mongoDb.js";
import ProductManager from "../dao/mongoDB/productManager.MongoDb.js";

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
        res.render('home.handlebars', {
            showProducts,
            style: 'home.css'
        });
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