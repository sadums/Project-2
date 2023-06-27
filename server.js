const path = require('path');
const express = require('express');
const cors = require('cors');

const session = require('express-session');
const expressHandlebars = require('express-handlebars');

const SequelizeStore = require('connect-session-sequelize')(session.Store);
const routes = require('./controllers');
const sequelize = require('./config/connection');

const app = express();
const PORT = process.env.PORT || 3001;

const sessionInstance = {
    secret: 'zdMwutRaKNRGMemRwgUNaHIZv',
    cookie: {},
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({
      db: sequelize,
    }),
};

app.use(session(sessionInstance));

const handlebars = expressHandlebars.create({});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public/')));

app.use('/', routes);

sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log('Now listening on http://localhost:3001'));
});
