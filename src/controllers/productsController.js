import uuidv4 from 'uuid/v4';
import { successResponse } from '../utils/response';
import { s3UploadBase64, s3RemoveFile } from '../utils/aws';

import { Product, Review } from '../models';

const productsController = {
    addProduct: async (req, res) => {
        const { user, body: { title, description, pictures } } = req;

        const promises = pictures.map(picture => s3UploadBase64(`${ uuidv4() }-${ picture.name }`, picture));
        const picturesUrl = await Promise.all(promises);

        await Product.create({
            title,
            description,
            pictures: picturesUrl,
            user: user._id,
        });

        return successResponse(res, { message: 'Product created successfully' });
    },

    getMyProducts: async (req, res) => {
        const { user } = req;

        const products = await Product
            .find({ user: user._id })
            .populate('user');

        return successResponse(res, products);
    },

    getProduct: async (req, res) => {
        const { params: { id } } = req;

        const product = await Product
            .findById(id)
            .populate('user')
            .populate('reviews.user');

        return successResponse(res, product);
    },

    getProducts: async (req, res) => {
        const products = await Product
            .find()
            .populate('user');

        return successResponse(res, products);
    },

    deleteProduct: async (req, res) => {
        const { params: { id } } = req;

        const product = await Product.findById(id);
        await Promise.all(product.pictures.map(picture => s3RemoveFile(picture.s3Key)));

        await Product.deleteOne({ _id: id });

        return successResponse(res, { message: 'Product deleted successfully' });
    },

    changeProduct: async (req, res) => {
        const { params: { id }, body: { title, description, pictures, deletedPictures } } = req;

        const promisesAdded = pictures.map(picture => s3UploadBase64(`${ uuidv4() }-${ picture.name }`, picture));
        const picturesUrlAdded = await Promise.all(promisesAdded);
        await Promise.all(deletedPictures.map(picture => s3RemoveFile(picture.s3Key)));

        const product = await Product.findById(id);

        const updatedPictures = product.pictures
            .filter(picture => !deletedPictures.find(pictureDeleted => picture.s3Key === pictureDeleted.s3Key))
            .concat(picturesUrlAdded);

        await Product.updateOne({
            _id: id
        }, {
            title,
            description,
            pictures: updatedPictures
        });

        return successResponse(res, { message: 'Product changed successfully' });
    },

    addReview: async (req, res) => {
        const { user, body: { rating, text }, params: { id } } = req;

        const product = await Product.findById(id);

        product.reviews.push(new Review({
                rating,
                text,
                user: user._id,
        }));

        await product.save();

        return successResponse(res, { message: 'Review added successfully' });
    }
};

export default productsController;