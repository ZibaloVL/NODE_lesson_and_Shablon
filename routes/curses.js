const auth = require('../middleware/auth');

const {
    Router
} = require('express');
const Course = require('../models/course');
const router = Router();
// const course = new Course(); // в референсе не создаётся новый обьект

router.get('/', async (req, res) => {
    try {
        const courses = await Course.find()
            .populate('userId', 'email name')
            .select('price title image')

        res.render('curses', {
            title: "Курсы",
            isComponent: true,
            userId: req.user ? req.user._id.toString() : null,
            courses // так предаётся переменная
        });
    } catch (error) {
        console.log(error);
    }


})

router.get('/:id/edit', auth,
    async (req, res) => {
        if (!req.query.allow) {
            return res.redirect('/')
        }
        try {
            const curse = await Course.findById(req.params.id);

            if (curse.userId.toString() !== req.user._id.toString()) {
                return res.redirect('/courses')
            }

            res.render('curse-edit', {
                title: `редактируем курс ${curse.title}`,
                curse
            })
        } catch (error) {
            console.log(error)
        }

    }
)

router.post('/edit', auth, async (req, res) => {
    //    console.log('curses/edit');
    // console.log('req.body', req.body);
    const {
        id
    } = req.body.id;
    delete req.body.id
    await Course.updateOne(id, req.body);
    res.redirect('/curses')
})

router.post('/remove', auth, async (req, res) => {
    try {
        await Course.deleteOne({
            _id: req.body.id
        });
        res.redirect('/curses');
    } catch (error) {
        console.log("не удалиkось");
        console.log(err);
    }

})


router.get('/:id', auth, async (req, res) => {
    // console.log('req.params.id  ', req.params.id);
    const courseOne = await Course.findById(req.params.id);
    // console.log('courseOne', courseOne);
    res.render('course', {
        layout: 'empty',
        title: `Курс ${courseOne.title}`,
        courseOne
    })
})





module.exports = router;