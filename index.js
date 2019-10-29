const express = require('express');
const mongoose = require('mongoose')
const path = require('path');
const csrf = require('csurf')
const exphbs = require('express-handlebars');
const session = require('express-session');
const MongoStore = require('connect-mongodb-session')(session);
const User = require('./models/user');
const varMiddleware = require('./middleware/variables');
const userMiddlware = require('./middleware/user');
const MONGODB_URI = `mongodb+srv://fotoroom:lcROiGz73NlNKrSW@nodeshoplearn-fif3b.gcp.mongodb.net/shop`;

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

const store = new MongoStore({
    collection: 'session',
    uri: MONGODB_URI
})
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({
    extended: true
}));
app.use(session({ //data in request.session 
    secret: 'some secret value', // line whith secret word
    resave: false,
    saveUninitialized: false,
    store: store
}));
app.use(csrf());
app.use(varMiddleware);
app.use(userMiddlware);

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

        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        app.listen(PORT, () => {
            console.log(`server start on port ${PORT}`);
        })
    } catch (error) {
        console.log(" нет соединения");
        console.log(error);
    }

}

start();