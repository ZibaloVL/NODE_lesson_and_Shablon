const {
    Router
} = require('express');
const Course = require('../models/course');
const router = Router();
// const course = new Course(); // в референсе не создаётся новый обьект

router.get('/', async (req, res) => {
    const courses = await Course.getAll();
    res.render('curses', {
        title: "curses",
        isComponent: true,
        courses // так предаётся переменная
    });
})

router.get('/:id/edit',
    async (req, res) => {
        if (!req.query.allow) {
            return res.redirect('/')
        }
        const curse = await Course.getById(req.params.id);
        res.render('curse-edit', {
            title: `редактируем курс ${curse.title}`,
            curse
        })
    }
)

router.post('/edit', async (req, res) => {
    console.log('curses/edit');
    await Course.update(req.body);
    res.redirect('/curse')
})


router.get('/:id', async (req, res) => {
    // console.log('req.params.id  ', req.params.id);
    const courseOne = await Course.getById(req.params.id);
    // console.log('courseOne', courseOne);
    res.render('course', {
        title: `Курс ${courseOne.title}`,
        courseOne
    })
})




module.exports = router;