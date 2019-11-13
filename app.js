const talk = require('./scripts/talk.js');

const express = require('express');
const consolidate = require('consolidate');
const bodyParser = require('body-parser');
const session = require('express-session');
const handlebars = require('handlebars');

const app = express();

app.engine('html', consolidate.handlebars);
app.set('view engine', 'html');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(session({
    //cookie: {secure: true},
    secret: 'ytu iujhimnbhu986 5rwes<DSWSFRCC FRC',
    resave: false,
    saveUninitialized: false,
}));

handlebars.registerHelper('addNewLines', (text) => {
    text = handlebars.Utils.escapeExpression(text);
    text = text.replace(/\n|\r\n|\r/g, "<br>");
    return new handlebars.SafeString(text);
})

app.get('/', (req, res) => {
    if (!req.session.userId) req.session.userId = req.session.id;
    const messages = talk.getHistoryMessages(req);
    res.render('index', {messages});
});

app.post('/', function(req, res) {
    if (!req.session.userId) req.session.userId = req.session.id;
    
    const answer = talk.getServerAnswer(req);
    const answerTemplate = handlebars.compile(answer.template);
    const renderedAnswer = answerTemplate(answer.data);
    
    res.send(renderedAnswer);
});

let port = process.env.PORT;
if (!port) {
    port = 3000;
}
app.listen(port, _ => console.log(`listening on port ${port}`));