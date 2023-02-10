import mongoose from "mongoose";

const productsCollection = 'products';

const productSchema = mongoose.Schema({
    name: String,
    description: String,
    category: String,
    code: String,
    price: Number,
    thumbnail: Array,
    stock: Number
});

const Product = mongoose.model(productsCollection, productSchema);

export default Product;