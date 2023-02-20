import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

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

productSchema.plugin(mongoosePaginate);
const Product = mongoose.model(productsCollection, productSchema);

export default Product;