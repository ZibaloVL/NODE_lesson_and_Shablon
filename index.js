const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');

/*routes begin*/
const routesHome = require('./routes/home');
const routesAdd = require('./routes/add');
const routesComponent = require('./routes/component');
const routes404 = require('./routes/404');
/*routes end */

const app = express();

app.use(express.static('public'));
app.use('/', routesHome);
app.use('/add', routesAdd);
app.use('/component', routesComponent);
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