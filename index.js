const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');


/*routes begin*/
const routesHome = require('./routes/home');
const routesAdd = require('./routes/add');
const routesComponent = require('./routes/curses');
const routes404 = require('./routes/404');
const routesCard = require('./routes/card');
/*routes end */

const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({
    extended: true
}));

app.use('/', routesHome);
app.use('/add', routesAdd);
app.use('/curses', routesComponent);
app.use('/card', routesCard);
app.use(routes404);

var hbs = exphbs.create({
    /* config */
    defaultLayout: 'main',
    extname: 'hbs'
});

// Register `hbs.engine` with the Express app.
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views')

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`server start on port ${PORT}`);
})