import { ProductModel } from '../../models/Product.js';

export default class ProductManager {
    getAll = async (limit = 10, page = 1, sort, query) => {
        const options = {
            limit,
            page,
            sort: sort ? { price: sort === 'asc' ? 1 : -1 } : {},
            lean: true
        };

        const filter = query ? { $or: [{ category: query }, { status: query === 'true' }] } : {};

        return await ProductModel.paginate(filter, options);
    }

    getById = async (id) => await ProductModel.findById(id).lean();
    create = async (data) => await ProductModel.create(data);
    update = async (id, data) => await ProductModel.findByIdAndUpdate(id, data, { new: true });
    delete = async (id) => await ProductModel.findByIdAndDelete(id);
}
