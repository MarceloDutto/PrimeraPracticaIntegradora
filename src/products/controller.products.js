import { Router } from 'express';
/* import ProductManager from '../dao/FileSystem/productManager.fileSystem.js'; */ // <= File system
import ProductManager from '../dao/mongoDB/productManager.MongoDb.js'; // <= Mongo DB
import __dirname, { uploader } from '../utils.js';

const path = __dirname + '/files/products.json';

/* const pm = new ProductManager(path) */ // <= File system
const pm = new ProductManager() // <= MongoDB

const router = Router();

router.get('/', async (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page)  || 1; 
    const query = req.query.query || "";
    const sort = req.query.sort || "";

    const sortLowercase = sort.toLowerCase()  ;
    
    try {
        const products = await pm.getProducts(limit, page, query, sortLowercase);
        return res.json(products);
    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'Error al acceder a los productos'});
    }
})

router.get('/:pid', async (req, res) => {
    const { pid } = req.params

    try {
        const productById = await pm.getProductById(pid);
        if(Object.keys(productById).length === 0) return res.status(404).json({message: 'Producto no encontrado'});
        res.json(productById);
    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'Error al acceder a los productos'});
    }
})

router.post('/', uploader.single('file'), async (req, res) => {
    const { name, description, category, code, price, thumbnail=[], stock } = req.body;
    if(!name || !description || !category || !code || !price || !stock) return res.status(400).json({message: 'Error en el ingreso de los campos'});

    const products = await pm.getProducts();
    if(products.find(prod => prod.code === code)) return res.status(500).json({message: 'El producto ya se encuentra ingresado en la base de datos'});

    const imgPath = req.file?.filename;
    const relativePath = `/img/${imgPath}`;
    thumbnail.push(relativePath);

    const newProduct = {
        name,
        description,
        category,
        code,
        price,
        thumbnail,
        stock
    }

    try {
        const response = await pm.addProduct(newProduct);
        res.status(201).json({message: response });
    } catch (error) {
        res.status(500).json({message: 'Error al ingresar el producto'});
    }
})

router.patch('/:pid', async (req, res) => {
    const { pid } = req.params;
    const { name, description, category, code, price, thumbnail, stock } = req.body;

    const product = {
        name, 
        description, 
        category, 
        code, 
        price, 
        thumbnail, 
        stock
    }

    try {
        const response = await pm.updateProduct(pid, product);
        res.json({message: response});
    } catch (error) {
        res.status(500).json({message: 'Error al actualizar el producto'});
    }
}) 

router.delete('/:pid', async (req, res) => {
    const { pid } = req.params;

    try {
        const response = await pm.deleteProduct(pid);
        res.json({message: response});
    } catch (error) {
        res.status(500).json({message: 'Error al eliminar el producto'}) 
    }
})

// dev
router.delete('/', async (req, res) => {
    try {
        const response = await pm.deleteAllProducts();
        res.json({message: response});
    } catch (error) {
        res.status(500).json({message: 'Error al eliminar los productos'})
    }
})

//dev
router.post('/populate', async (req, res) => {
    try {
        const response = await pm.populateDB();
        res.json({message: response});
    } catch (error) {
        res.json({message: `No se pudo cargar a la base de datos. Error: ${error}`});
    }
})
export default router;