import mongoose from "mongoose";

const cartsCollection = 'carts';

const cartSchema = mongoose.Schema({
    products: Array
})

const Cart = mongoose.model(cartsCollection, cartSchema);

export default Cart;