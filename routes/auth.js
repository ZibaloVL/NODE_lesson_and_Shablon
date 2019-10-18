const {
    Router
} = require('express');
const User = require('../models/user');
router = Router();

router.get('/login', async (req, res) => {
    res.render('auth/login', {
        title: 'авторизация',
        isLogin: true
    })
})

router.get('/logout', async (req, res) => {
    req.session.destroy(() => { // callback active after cleanin session
        res.redirect('/auth/login#login');
    })
})

router.post('/login', async (req, res) => {
    const user = await User.findById('5d9c8f0822388d08a851f5b5');
    req.session.user = user;
    req.session.isAuthenticated = true;
    req.session.save(err => { // method for awaiting get from db param user!!!!
        if (err) {
            console.log('err connect');
            throw err;
        }
        res.redirect('/');
    })
    console.log('req.session', req.session);
})

router.post('/register', async (req, res) => {
    try {
        console.log('req.body', req.body);
        const {
            email,
            password,
            repeat,
            name
        } = req.body;
        const candidate = await User.findOne({
            email
        });

        if (candidate) {
            // console.log('/auth/login#register');
            res.redirect('/auth/login#register');
        } else {
            const user = new User({
                email,
                name,
                password,
                cart: {
                    'items': []
                }
            });
            await user.save();
            // console.log('/auth/login#login');
            res.redirect('/auth/login#login');
        }

    } catch (error) {
        console.log(error)
    }
})

module.exports = router;