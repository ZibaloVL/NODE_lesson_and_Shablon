const {
    Router
} = require('express');
const Course = require('../models/course');
const router = Router();
const auth = require('../middleware/auth');

router.get('/', auth, (req, res) => {
    res.render('add', {
        title: 'Добавить курс',
        isAdd: true
    });
})

router.post('/', auth, async (req, res) => {
    console.log('req.body____', req.body);
    //  const course = new Course(req.body.title, req.body.price, req.body.image)
    console.log("req.user", req.user);
    const course = new Course({
        title: req.body.title,
        price: req.body.price,
        image: req.body.image,
        userId: req.user
    })
    try {
        await course.save();
        console.log('sending!!!!!!!!!!!!!!!!!!!!!!');
        res.redirect('/curses');
    } catch (error) {
        console.log("НЕ ОТПРАВИЛОСЬ!!");
        console.log(error);
    }

})


module.exports = router;