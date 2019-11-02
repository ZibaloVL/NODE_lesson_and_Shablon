const {
    Router
} = require('express');
const auth = require('../middleware/auth');
const User = require('../models/user');
const router = Router();


router.get('/', async (req, res) => {
    console.log ('req.user.toObject()', req.user.toObject());
    res.render('profile', {
        title: 'Profil user',
        isProfile: true,
        user: req.user.toObject()
    })
})

router.post('/', async (req, res) => {
    console.log('req.body ', req.body);
    try {
        const user = await User.findById(req.user._id);
        const toChange = {
            name : req.body.name
        }
        console.log('req.file ----', req.file);
        if(req.file) {
            toChange.avatarUrl = req.file.path;
        }

        Object.assign(user, toChange);
        await user.save();
        res.redirect('/profile');
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;