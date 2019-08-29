import mongoose, { Schema } from 'mongoose';

const ProductSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        allowNull: false,
    },
    pictures: [{
        s3Key: String,
        name: String,
        url: String
    }],
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
}, {
    timestamps: true,
    toJSON: {
        transform: (doc, ret) => {
            delete ret.createdAt;
            delete ret.updatedAt;
            delete ret.__v;
        }
    },
    toObject: {
        transform: (doc, ret) => {
        }
    }
});

class ProductClass {
}

ProductSchema.loadClass(ProductClass);

const Product = mongoose.model('Product', ProductSchema);

export default Product;