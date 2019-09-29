const {
    Router
} = require('express');
const router = Router();

router.get('/', (req, res) => {
    res.render('component', {
        title: "component",
        isComponent: true
    });
})


module.exports = router;