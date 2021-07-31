const express = require('express');
const routes = require('./controllers');
const sequelize = require('./config/connection');
const path = require('path');

// helper
const helpers = require('./helpers');

// handlebars  
const exphbs = require('express-handlebars');
const hbs = exphbs.create({helpers});

// session connection to sequelize db
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 3000;

const SequelizeStore = require('connect-session-sequelize')(session.Store);

// creates the session
const sess = {
    secret: 'the unknown',
    cookie: { originalMaxAge: 60000 },
    saveUninitialized: false,
    resave: false,
    store: new SequelizeStore({
        db: sequelize,
    })
};

app.use(session(sess));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// default engine set to handlebars
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// activate routes
app.use('/', routes);

// db server connection
sequelize.sync({force: false}).then(() => {
    app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
    });
});