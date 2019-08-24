import uuidv4 from 'uuid/v4';
import { successResponse } from '../utils/response';
import { s3UploadBase64, s3RemoveFile } from '../utils/aws';

import {Product, Review} from '../models';

const productsController = {
    addProduct: async (req, res) => {
        const { user, body: { title, description, pictures } } = req;

        const promises = pictures.map(picture => s3UploadBase64(`${ uuidv4() }-${ picture.name }`, picture));
        const picturesUrl = await Promise.all(promises);

        await user.createProduct({
            title,
            description,
            pictures: picturesUrl
        });

        return successResponse(res, { message: 'Product created successfully' });
    },

    getMyProducts: async (req, res) => {
        const { user } = req;

        const products = await user.getProducts({
            include: [
                {
                    model: User,
                    attributes: ['userName', 'email']
                }
            ]
        });

        return successResponse(res, products);
    },

    getProduct: async (req, res) => {
        const { params: { id } } = req;

        const product = await Product.findByPk(id, {
                include: [
                    {
                        model: User,
                        attributes: ['userName', 'email']
                    },
                    {
                        model: Review,
                        include: [{
                            model: User,
                            attributes: ['userName', 'email']
                        }]
                    }
                ]
            }
        );

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

        await Product.destroy({
            where: {
                id
            }
        });

        return successResponse(res, { message: 'Product deleted successfully' });
    },

    changeProduct: async (req, res) => {
        const { params: { id }, body: { title, description, pictures, deletedPictures } } = req;

        const promisesAdded = pictures.map(picture => s3UploadBase64(`${ uuidv4() }-${ picture.name }`, picture));
        const picturesUrlAdded = await Promise.all(promisesAdded);
        await Promise.all(deletedPictures.map(picture => s3RemoveFile(picture.s3Key)));

        const product = await Product.findByPk(id);

        const updatedPictures = product.pictures
            .filter(picture => !deletedPictures.find(pictureDeleted => picture.s3Key === pictureDeleted.s3Key))
            .concat(picturesUrlAdded);

        await Product.update({
            title,
            description,
            pictures: updatedPictures
        }, {
            where: {
                id
            }
        });

        return successResponse(res, { message: 'Product changed successfully' });
    },

    addReview: async (req, res) => {
        const { user, body: { rating, text }, params: { id } } = req;

        await Review.create({
            rating,
            text,
            userId: user.id,
            productId: id
        });

        return successResponse(res, { message: 'Review added successfully' });
    }
};

export default productsController;