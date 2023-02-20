import Product from "./models/products.models.js";
import fileManager from './../FileSystem/fileManager.fileSystem.js';
const fm = new fileManager('products.json')

class ProductManager {

    getProducts = async (limit, page, query, sort) => {
        let filter = {};

        query? filter = {category: query} : filter = {};

        const options = {
            limit,
            page,
            sort: {price: sort}
        }

        try {
            const response = await Product.paginate(filter, options);
            return {
                status: "success",
                payload: response,
                totalPages: response.totalPages,
                prevPage: response.prevPage,
                nextPage: response.nextPage,
                page: response.page,
                hasPrevPage: response.hasPrevPage,
                hasNextPage: response.hasNextPage,
                prevLink: `http://localhost:3000/api/products?limit=${limit}&page=${response.prevPage}`,
                nextLink: `http://localhost:3000/api/products?limit=${limit}&page=${response.prevPage}`

            } 
        } catch (error) {
            console.log(error)
            return {
                status: "error",
                payload: []
            }
        }
    }

    getProductById = async (idRef) => {
        try {
            const prodByID = await Product.findById(idRef);
            return prodByID ? prodByID : {}
        } catch (error) {
            console.log(error);
        }
    }

    addProduct = async (product) => {
        try {
            await Product.create(product);
            return 'Producto creado'
        } catch (error) {
            console.log(error);
        }
    }

    updateProduct = async (idRef, updates) => {
        try {
            await Product.findByIdAndUpdate(idRef, updates);
            return 'El producto fue actualizado';
        } catch {
            console.log(error);
        }
    }

    deleteProduct = async (idRef) => {
        try {
            await Product.findByIdAndDelete(idRef);
            return 'Producto eliminado'
        } catch (error) {
            console.log(error);
        }
    }

    deleteAllProducts = async () => {
        try {
            await Product.deleteMany();
            return 'Todos los productos fueron eliminados'
        } catch (error) {
            console.log(error);
            return `Error al eliminar los productos: Error: ${error}`;
        }
    }

    populateDB = async () => {
        try {
            const products = await fm.loadItems();

            await Product.insertMany(products);
            return 'Productos cargados'

        } catch (error) {
            console.log(error);
            return `Error al cargar los productos: Error: ${error}`;
        }
    }
}

export default ProductManager;