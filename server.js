//imports
var express     = require('express');
var bodyParser  = require('body-parser');
var apiRouter   = require('./apiRouter').router;

var server = express();

//body parser conf
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());

server.get('/', (req,res) => {
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send('<h1>Hello</h1>');
});

server.use('/api/', apiRouter);

server.listen(3000, () => {
    console.log('server en ecoute')
});