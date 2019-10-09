const {
    Router
} = require('express');
const Course = require('../models/course');
const router = Router();

router.post('/add', async (req, res) => {
    console.log("req.body.id", req.body.id);
    console.log('req.user');
    const course = await Course.findById(req.body.id);
    await req.user.addTocart(course);
    console.log('add to card!!');
    res.redirect('/card');
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
})

router.delete('/remove/:id', async (req, res) => {
    console.log("req.params.id", req.params.id);
    card = await Card.remove(req.params.id);
    res.status(200).json(card)
})

module.exports = router;