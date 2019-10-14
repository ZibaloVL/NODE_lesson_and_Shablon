const{Router} = require('express');
router = Router();

router.get('/login', async(req,res) => {
    res.render('auth/login', {
        title: 'авторизация',
        isLogin: true
    })
})


module.exports = router;