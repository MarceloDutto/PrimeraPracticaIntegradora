import fs, { existsSync, writeFile, promises } from 'fs';
import { v4 as uuidv4 } from 'uuid';

class ProductManager {
    constructor(path) {
        this.products = [];
        this.path = path
    }

    getProducts = async () => {
        if(!existsSync(this.path)) return [];

        try {
            const data = await promises.readFile(this.path, 'utf-8');
            this.products = JSON.parse(data);
            return this.products;
        } catch (error) {
            console.log(error)
        }
    }

    getProductById = async (idRef) => {
        if(!existsSync(this.path)) return {};

        await this.getProducts()

        const prodById = this.products.find(prod => prod.id === idRef);
        return prodById ? prodById : {};
    }

    addProduct = async (product) => {
        const { code } = product;

        await this.getProducts();

        if(this.products.find(prod => prod.code === code)) return 'El producto ya se encuentra en la base de datos';

        let id;
        let uniqueId = false;
        while (uniqueId === false) {
            id = uuidv4();
            uniqueId = this.products.forEach(prod => prod.id === id) ? false : true;
        }

        const productToAdd = {
            id,
            ...product
        } 

        this.products.push(productToAdd);
        const productsStr = JSON.stringify(this.products, null, 2);
        writeFile(this.path, productsStr, error => {
            if(error) {
                throw error
            }
        });

        return 'Producto ingresado exitosamente'
    }   

    updateProduct = async (idRef, updates) => {
        if(!existsSync(this.path)) return 'No se encontró la base de datos';

        const selectedProduct = await this.getProductById(idRef);
        if(Object.keys(selectedProduct).length === 0) return 'No se encontró el producto';
         
        const productToUpdate = {
            ...updates
        };

        Object.keys(productToUpdate).forEach(key => {
            if(productToUpdate[key] && productToUpdate[key] !== selectedProduct[key]) selectedProduct[key] = productToUpdate[key];
        });

        const productsStr = JSON.stringify(this.products, null, 2);
        writeFile(this.path, productsStr, error => {
            if(error) {
                throw error
            }
        });

        return 'El producto fue actualizado';
    }

    deleteProduct = async (idRef) => {
        if(!existsSync(this.path)) return 'No se encontró la base de datos';

        await this.getProducts();

        const indexById = this.products.findIndex(prod => prod.id === idRef);
        if(indexById === -1 ) return 'Producto no encontrado';
        this.products.splice(indexById, 1);

        const productsStr = JSON.stringify(this.products, null, 2);
        writeFile(this.path, productsStr, error => {
            if(error) {
                throw error
            }
        });

        return 'El producto fue eliminado';
    }
    
}

export default ProductManager;