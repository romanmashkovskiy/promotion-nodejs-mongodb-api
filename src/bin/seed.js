import models from '../models';

const {User, Product, Review} = models;

const seed = () => {
    return Promise.all([
        User.create({
            id: '0c683b6e-32d5-445d-bd1a-589ea455106b',
            userName: 'User1',
            email: 'user1@gmail.com',
            password: 'asdfasdf'
        }),
        User.create({
            id: 'ad912e3f-432c-4723-8245-2eb3a665b0b0',
            userName: 'User2',
            email: 'user2@gmail.com',
            password: 'asdfasdf'
        }),
        Product.create({
            id: '7fd51310-f0a4-4f50-8203-66fb098ff4e1',
            title: 'Phone1',
            description: 'nice phone1',
            pictures: []
        }),
        Product.create({
            id: '5c180ddc-5073-41fe-8fae-4223ed0bb39e',
            title: 'Phone2',
            description: 'nice phone2',
            pictures: []
        }),
        Product.create({
            id: 'b817c071-9784-451f-a737-c124c862fd96',
            title: 'Phone3',
            description: 'nice phone3',
            pictures: []
        }),
        Product.create({
            id: 'd33be0c7-50b8-4c17-9dfe-2683272e7bc6',
            title: 'Phone4',
            description: 'nice phone4',
            pictures: []
        }),
        Review.create({
            id: '0ad7a87c-26e1-4798-92b5-ad943c5f976c',
            rating: 1,
            text: 'very bad phone'
        }),
        Review.create({
            id: 'fe79babe-2bc6-4499-8daf-5515080a8c01',
            rating: 2,
            text: 'bad phone'
        }),
        Review.create({
            id: '1343c8cc-dfc5-4fbe-84aa-1783597149fb',
            rating: 3,
            text: 'not bad phone'
        }),
        Review.create({
            id: 'da6347c3-8192-48b0-96ab-64ed6787940a',
            rating: 4,
            text: 'good phone'
        }),
        Review.create({
            id: 'd7a4fe0c-0aa5-4a27-854b-db1ea556119a',
            rating: 5,
            text: 'very good phone'
        }),
    ])
        .then(([User1, User2, Product1, Product2, Product3, Product4, Review1, Review2, Review3, Review4, Review5]) => {
            return Promise.all([
                Product1.setUser(User1),
                Product2.setUser(User1),
                Product3.setUser(User2),
                Product4.setUser(User2),
                Review1.setProduct(Product1),
                Review2.setProduct(Product2),
                Review3.setProduct(Product3),
                Review4.setProduct(Product4),
                Review5.setProduct(Product4),
                Review1.setUser(User1),
                Review2.setUser(User1),
                Review3.setUser(User1),
                Review4.setUser(User2),
                Review5.setUser(User2),
            ]);
        })
        .catch(error => console.log(error));
};

export default seed;