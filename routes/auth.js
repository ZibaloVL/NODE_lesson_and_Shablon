const {Router} = require('express');
const User =require('../models/user');
router = Router();

router.get('/login', async(req,res) => {
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

router.post('/login', async (req, res)=>{
    const user = await User.findById('5d9c8f0822388d08a851f5b5');
    req.session.user = user;
    req.session.isAuthenticated = true;
    req.session.save(err => { // method for awaiting get from db param user!!!!
        if(err){
            console.log('err connect');
            throw err;
        }
        res.redirect('/');
    })
    console.log('req.session', req.session);
    res.redirect('/');
})

module.exports = router;