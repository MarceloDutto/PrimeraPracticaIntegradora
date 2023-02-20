import mongoose, { mongo } from "mongoose";

const cartsCollection = 'carts';

const cartSchema = mongoose.Schema({
    products: {
        type: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "products"
                },
                quantity: Number
            }
        ],
        default: []
    }
})

cartSchema.pre('find', function(){
    this.populate('products.product');
})

const Cart = mongoose.model(cartsCollection, cartSchema);

export default Cart;