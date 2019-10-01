const {
    Router
} = require('express');
const Course = require('../models/course');
const router = Router();
const course = new Course(); // в референсе не создаётся новый обьект

router.get('/', async (req, res) => {
    const courses = await course.getAll();
    res.render('curses', {
        title: "curses",
        isComponent: true,
        courses // так предаётся переменная
    });
})




module.exports = router;