const express = require('express');
const mongoose = require('mongoose')
const path = require('path');
const exphbs = require('express-handlebars');
const MongoClient = require('mongodb').MongoClient;


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

//uNWYUFS7l0kBvJPd
/*
const uri = "mongodb+srv://fotoroom:uNWYUFS7l0kBvJPd@nodeshoplearn-fif3b.gcp.mongodb.net/admin?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
    useNewUrlParser: true
});


client.connect(err => {
    const collection = client.db("test").collection("devices");
    // perform actions on the collection object
    app.listen(PORT, () => {
        console.log(`server start on port ${PORT}`);
    })
    client.close();
});

*/
//lcROiGz73NlNKrSW
async function start() {
    try {
        const url = `mongodb+srv://fotoroom:lcROiGz73NlNKrSW@nodeshoplearn-fif3b.gcp.mongodb.net/shop`
        // const url = `mongodb+srv://fotoroom:lcROiGz73NlNKrS@nodeshoplearn-fif3b.gcp.mongodb.net/admin?retryWrites=true&w=majority`
        await mongoose.connect(url, {
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