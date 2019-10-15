const express = require('express');
const mongoose = require('mongoose')
const path = require('path');
const exphbs = require('express-handlebars');
const session = require('express-session');
const User = require('./models/user');
const varMiddleware = require('./middleware/variables');


/*routes begin*/
const routesHome = require('./routes/home');
const routesAdd = require('./routes/add');
const routesComponent = require('./routes/curses');
const routes404 = require('./routes/404');
const routesCard = require('./routes/card');
const routesOrders = require('./routes/orders');
const authRoutes = require('./routes/auth');
/*routes end */

const app = express();
// Register `hbs.engine` with the Express app.
const hbs = exphbs.create({
    /* config */
    defaultLayout: 'main',
    extname: 'hbs'
});
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(async (req, res, next) => {
    try {
        const user = await User.findById('5d9c8f0822388d08a851f5b5');
        req.user = user;
        //console.log('rreq.user', req.user);
        next();
    } catch (error) {
        console.log(' нет авториизации')
        console.log(error);
    }
})

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({
    extended: true
}));
app.use(session({ //data in request.session 
    secret: 'some secret value', // line whith secret word
    resave: false,
    saveUninitialized: false
}));
app.use(varMiddleware);

app.use('/', routesHome);
app.use('/add', routesAdd);
app.use('/curses', routesComponent);
app.use('/card', routesCard);
app.use('/orders', routesOrders);
app.use('/auth', authRoutes);
app.use(routes404);


const PORT = process.env.PORT || 3000;


async function start() {
    try {
        const url = `mongodb+srv://fotoroom:lcROiGz73NlNKrSW@nodeshoplearn-fif3b.gcp.mongodb.net/shop`
        await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        const candidate = await User.findOne();
        if (!candidate) {
            const user = new User({
                email: 'fotoroom.md@gmail.com',
                name: 'Zibalo',
                cart: {
                    items: []
                }
            })
            await user.save();
        }
        app.listen(PORT, () => {
            console.log(`server start on port ${PORT}`);
        })
    } catch (error) {
        console.log(" нет соединения");
        console.log(error);
    }

}

start();