const {
    Router
} = require('express');
const Course = require('../models/course');
const router = Router();

function mapCartItems(cart) {
    return cart.items.map(c => ({
        ...c.courseId._doc,
        id: c.courseId.id,
        count: c.count
    }))
}

function calckPrice(courses) {
    let price = 0;
    courses.forEach(element => {
        price = price + element.count * element.price;
    });
    return price;
}

router.post('/add', async (req, res) => {
    //    console.log("req.body.id", req.body.id);
    //    console.log('req.user');
    const course = await Course.findById(req.body.id);
    await req.user.addTocart(course);
    console.log('add to card!!');
    res.redirect('/card');
    /////// разобраться какие _id &  idcourse
})

router.get('/', async (req, res) => {

    const user = await req.user
        .populate('cart.items.courseId')
        .execPopulate();
    //    console.log("user.cart.items", user);

    const courses = mapCartItems(user.cart);
    // console.log("course", courses);
    res.render('card', {
        title: 'корзина',
        courses: courses,
        isCard: true,
        price: calckPrice(courses)
    })
})

router.delete('/remove/:id', async (req, res) => {
    await req.user.removeFromCart(req.params.id);
    const user = await req.user
        .populate('cart.items.courseId')
        .execPopulate();
    console.log("user.cart.items", user);
    const courses = mapCartItems(user.cart);
    const cart = {
        courses,
        price: calckPrice(courses)
    }
    res.status(200).json(cart)
})

module.exports = router;