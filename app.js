const talk = require('./scripts/talk.js');

const PORT = 80;

const express = require('express');
const consolidate = require('consolidate');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();

app.engine('html', consolidate.handlebars);
app.set('view engine', 'handlebars');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(session({
    //cookie: {secure: true},
    secret: 'ytu iujhimnbhu986 5rwes<DSWSFRCC FRC',
    resave: false,
    saveUninitialized: false,
}));

app.get('/', (req, res) => res.render('index.html'));

app.post('/', function(req, res) {
    if (!req.session.userId) req.session.userId = req.session.id;
    const answer = talk.getServerAnswer(req);
    console.log(req.body.message, answer);
    res.send(answer);
});

app.listen(port, _ => console.log(`listening on port ${PORT}`));