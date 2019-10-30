const {
    Router
} = require('express');
const bcrypt = require('bcryptjs'); //methods for shifring
const nodemailer = require('nodemailer');
const sendgrid = require('nodemailer-sendgrid-transport');
const User = require('../models/user');
const regEmail = require('../email/registration.js')
const keys = require('../keys/index.js');
router = Router();

const transporter = nodemailer.createTransport(sendgrid({
    auth:{
        api_key: keys.SENDGRID_API_KEY
    }
}));

router.get('/login', async (req, res) => {
    res.render('auth/login', {
        title: 'авторизация',
        isLogin: true,
        loginError: req.flash('loginError'),
        registrError: req.flash('registrError')
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
                req.flash('loginError', 'Parol error')
                res.redirect('/auth/login#login');
            }
        } else {
            req.flash('loginError', 'User not found');
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
            req.flash('registrError', 'Dublicate user');
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
            await transporter.sendMail(regEmail(email))  // send email registration
        }

    } catch (error) {
        console.log(error)
    }
})

module.exports = router;