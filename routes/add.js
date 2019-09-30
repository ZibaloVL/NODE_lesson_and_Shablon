const {
    Router
} = require('express');
const Course = require('../models/course');
const router = Router();

router.get('/', (req, res) => {
    res.render('add');
})

router.post('/', async (req, res) => {
    console.log(req.body);
    const course = new Course(req.body.title, req.body.price, req.body.image)
    await course.save();
    res.redirect('/curses');
})


module.exports = router;