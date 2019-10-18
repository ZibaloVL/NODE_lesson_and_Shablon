const {
    Router
} = require('express');
const bcrypt = require('bcryptjs'); //methods for shifring
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
    try {
        const {
            email,
            password
        } = req.body;
        const candidate = await User.findOne({
            email
        })
        if (candidate) {
            const areSame = await bcrypt.compare(password, candidate.password);
            if (areSame) {
                const user = candidate;
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

            } else {
                res.redirect('/auth/login#login');
            }
        } else {
            console.log('/auth/login#login');
            res.redirect('/auth/login#login');
        }
    } catch (error) {
        console.log(error);
    }
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
            const hashPassword = await bcrypt.hash(password, 10);
            const user = new User({
                email,
                name,
                password: hashPassword,
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