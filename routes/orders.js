const {
    Router
} = require('express');
const Order = require('../models/order');
const router = Router();


router.get('/', async (req, res) => {
    try {
        const orders = await Order.find({
                'user.userId': req.user._id
            })
            .populate('user.userId')
        // console.log("orders", orders);
        const sendOrder = orders.map(o => {
            return {
                ...o._doc,
                price: o.courses.reduce((total, c) => {
                    return total += c.count * c.course.price
                }, 0)
            }
        });
        console.log("sendOrder", sendOrder);
        res.render('orders', {
            isOrder: true,
            title: "заказы",
            orders: sendOrder
        })
    } catch (error) {
        console.log(error);
    }

})

router.post('/', async (req, res) => {
    try {
        const user = await req.user
            .populate('cart.items.courseId')
            .execPopulate()
        //console.log('user', user);
        const courses = user.cart.items.map(i => ({
            count: i.count,
            course: {
                ...i.courseId._doc
            }
        }))
        //console.log('courses', courses);

        const order = new Order({
            user: {
                name: req.user.name,
                userId: req.user
            },
            courses: courses
        })

        await order.save();
        await req.user.clearCart();

        res.redirect('/orders');
    } catch (error) {
        console.log('не очистилась');
        console.log(error);
    }

})


module.exports = router;