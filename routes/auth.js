const{Router} = require('express');
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

router.post('/login', (req, res)=>{
    req.session.isAuthenticated = true;
    console.log('req.session', req.session);
    res.redirect('/');
})

module.exports = router;