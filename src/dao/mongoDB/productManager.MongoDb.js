import Product from "./models/products.models.js";

class ProductManager {

    getProducts = async () => {
        try {
            const products = await Product.find();
            return products;
        } catch (error) {
            console.log(error)
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
        await Product.deleteMany();
        return 'Todos los productos fueron eliminados'
    }
}

export default ProductManager;