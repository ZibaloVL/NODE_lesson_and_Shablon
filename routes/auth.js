const {
    Router
} = require('express');
const bcrypt = require('bcryptjs'); //methods for shifring
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const sendgrid = require('nodemailer-sendgrid-transport');
const User = require('../models/user');
const regEmail = require('../email/registration.js')
const keys = require('../keys/index.js');
const resetEmail = require(`../email/reset.js`);
router = Router();

const transporter = nodemailer.createTransport(sendgrid({
    auth: {
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
            try {
                await user.save();
                await transporter.sendMail(regEmail(email)) // send email registration
                console.log('/auth/login#login')
                res.redirect('/auth/login#login');
            } catch (error) {
                console.log('error', error);
            }

        }

    } catch (error) {
        console.log(error)
    }
})

router.get('/reset', (req, res) => {
    res.render('auth/reset', {
        title: 'Забыли пароль',
        error: req.flash('error')
    })
})

router.post('/reset', (req, res) => {
    try {
        crypto.randomBytes(32, async (err, buffer) => {
            if (err) {
                req.flash('error', 'Чтото пошло не так, повторите попытку позже')
                return res.redirect('auth/reset')
            }
            const token = buffer.toString('hex');
            const candidate = await User.findOne({
                email: req.body.email
            })
            if (candidate) {
                candidate.resetToken = token;
                candidate.resetTokenExp = Date.now() + 60 * 60 * 1000;
                await candidate.save();
                await transporter.sendMail(resetEmail(candidate.email, token));
                res.redirect('/auth/login');
            } else {
                req.flash('error', 'Такого email нет')
                res.redirect('/auth/reset')
            }
        })
    } catch (error) {
        console.log(error)
    }
})

router.get('password/:token', async (req, res) => {
    if (req.params.token) {
        return res.redirect('/auth/login')
    }
    try {
        const user = await User.findOne({
            resetToken: req.params.token,
            resetTikenExp: {
                $gt: Date.now
            }
        })
        if (!user) {
            return redirect('/auth/login')
        } else {
            res.render('auth/password', {
                title: 'Восстановить доступ',
                error: req.flash('error'),
                userId: user._id.toString(),
                token: req.params.token
            })
        }
    } catch (error) {
        console.log(err);
    }

})

module.exports = router;