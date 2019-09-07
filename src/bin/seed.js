#!/usr/bin/env node

import 'babel-polyfill';
import mongoose from '../core/mongoose';
import { User, Product, Review } from '../models';

const seedUsers = [
    {
        _id: '5d616bf8d5ddb142e8c55bcc',
        userName: 'User1',
        email: 'user1@gmail.com',
        password: 'asdfasdf',
        isConfirmed: true
    },
    {
        _id: '5d616bf8d5ddb142e8c55bcd',
        userName: 'User2',
        email: 'user2@gmail.com',
        password: 'asdfasdf',
        isConfirmed: true
    },
];

const seedProducts = [
    {
        _id: '5d6176a5d0145f48ac2777d7',
        title: 'Phone1',
        description: 'nice phone1',
        pictures: [],
        user: 0
    },
    {
        _id: '5d6176a5d0145f48ac2777d8',
        title: 'Phone2',
        description: 'nice phone2',
        pictures: [],
        user: 0
    },
    {
        _id: '5d6176a5d0145f48ac2777d9',
        title: 'Phone3',
        description: 'nice phone3',
        pictures: [],
        user: 1
    },
    {
        _id: '5d6176a5d0145f48ac2777da',
        title: 'Phone4',
        description: 'nice phone4',
        pictures: [],
        user: 1
    },
];

const seedReviews = [
    {
        _id: '5d6178ba900d4749a88a9191',
        rating: 1,
        text: 'very bad phone',
        user: 0,
        product: 0
    },
    {
        _id: '5d6178ba900d4749a88a9192',
        rating: 2,
        text: 'bad phone',
        user: 0,
        product: 1
    },
    {
        _id: '5d6178ba900d4749a88a9193',
        rating: 3,
        text: 'not bad phone',
        user: 1,
        product: 2
    },
    {
        _id: '5d6178ba900d4749a88a9194',
        rating: 4,
        text: 'good phone',
        user: 1,
        product: 3
    },
    {
        _id: '5d6178ba900d4749a88a9195',
        rating: 5,
        text: 'very good phone',
        user: 1,
        product: 3
    },
];

mongoose.connection.once('open', async () => {
    /* Users */
    await User.deleteMany();
    console.log('Users collection removed');
    const users = await Promise.all(seedUsers.map(user => User.create({
        ...user
    })));
    console.log(`${ users.length } users success added`);

    /* Products */
    await Product.deleteMany();
    console.log('Products collection removed');
    const products = await Promise.all(seedProducts.map((product, index) => Product.create({
            ...product,
            user: users[product.user].id,
            reviews: seedReviews.filter(review => review.product === index).map(review => review._id)
        })
    ));
    console.log(`${ products.length } products success added`);

    /* Reviews */
    await Review.deleteMany();
    console.log('Reviews collection removed');
    const reviews = await Promise.all(seedReviews.map(review => Review.create({
        ...review,
        user: users[review.user].id,
        product: products[review.product].id
    })));
    console.log(`${ reviews.length } reviews success added`);

    /* Exit */
    process.exit(0);
});