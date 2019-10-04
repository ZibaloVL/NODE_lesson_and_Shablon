const {
    Router
} = require('express');
const Card = require('../models/card');
const Course = require('../models/course');
const router = Router();

router.post('/add', async (req, res) => {
    console.log("req.body.id", req.body.id);
    const course = await Course.getById(req.body.id);
    await Card.add(course);
    res.redirect('/card');
})

router.get('/', async (req, res) => {
    const card = await Card.fetch();
    res.render('card', {
        title: 'корзина',
        courses: card.courses,
        price: card.price
    })
})

router.delete('/remove/:id', async (req, res) => {
    console.log("req.params.id", req.params.id);
    card = await Card.remove(req.params.id);
    res.status(200).json(card)
})

module.exports = router;