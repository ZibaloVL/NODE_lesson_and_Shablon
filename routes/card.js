const {
    Router
} = require('express');
const Course = require('../models/course');
const router = Router();

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
    /*    
        const card = await Card.fetch();
        res.render('card', {
            title: 'корзина',
            courses: card.courses,
            price: card.price
        })
    */
    const user = await req.user
        .populate('cart.items.courseId')
        .execPopulate();
    //    console.log("user.cart.items", user);

    function mapCartItems(cart) {
        return cart.items.map(c => ({
            ...c.courseId._doc,
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
    console.log("req.params.id", req.params.id);
    card = await Card.remove(req.params.id);
    res.status(200).json(card)
})

module.exports = router;