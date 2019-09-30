const {
    Router
} = require('express');
const router = Router();

router.get('/', (req, res) => {
    res.render('curses', {
        title: "curses",
        isComponent: true
    });
})



module.exports = router;