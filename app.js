const express = require('express');
const consolidate = require('consolidate');
const bodyParser = require('body-parser');
const app = express();
const port = 3001;

app.engine('html', consolidate.handlebars);
app.set('view engine', 'handlebars');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//app.get('/', (req, res) => res.send('Hello from server!'));
app.get('/', (req, res) => res.render('index.html'));

app.post('/', function(req, res) {
    //console.log(req);
    res.sendStatus(200);
});

app.listen(port, _ => console.log(`listening on port ${port}`));