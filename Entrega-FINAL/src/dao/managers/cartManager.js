import { CartModel } from '../../models/Cart.js';

export default class CartManager {
    getById = async (cid) => await CartModel.findById(cid).populate('products.product').lean();
    create = async () => await CartModel.create({});
    addProduct = async (cid, pid, qty = 1) => {
        const cart = await CartModel.findById(cid);
        const index = cart.products.findIndex(p => p.product.equals(pid));
        if (index >= 0) {
            cart.products[index].quantity += qty;
        } else {
            cart.products.push({ product: pid, quantity: qty });
        }
        return await cart.save();
    }

    updateProducts = async (cid, newProducts) => {
        return await CartModel.findByIdAndUpdate(cid, { products: newProducts }, { new: true });
    }

    updateQuantity = async (cid, pid, qty) => {
        const cart = await CartModel.findById(cid);
        const prod = cart.products.find(p => p.product.equals(pid));
        if (prod) prod.quantity = qty;
        return await cart.save();
    }

    deleteProduct = async (cid, pid) => {
        return await CartModel.findByIdAndUpdate(cid, {
            $pull: { products: { product: pid } }
        }, { new: true });
    }

    deleteAll = async (cid) => {
        return await CartModel.findByIdAndUpdate(cid, { products: [] }, { new: true });
    }
}
