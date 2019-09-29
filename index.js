const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars')

const app = express();

app.use(express.static('public'));

var hbs = exphbs.create({
    /* config */
    defaultLayout: 'main',
    extname: 'hbs'
});

// Register `hbs.engine` with the Express app.
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views')
/* routing________________________________ */

app.get('/', (req, res) => {
    res.render('index', {
            title: "home",
            isHome: true
        }

    );
})

app.get('/about', (req, res) => {
    res.render('about');
})

app.get('/component', (req, res) => {
    res.render('component', {
        title: "component",
        isComponent: true
    });
})

app.get('/add', (req, res) => {
    res.render('add', {
        title: "ADD",
        isAdd: true
    });
})

app.get('*', (req, res) => {
    res.render('404');
})



const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`server start on port ${PORT}`);
})