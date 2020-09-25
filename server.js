//imports
var express = require('express');

var server = express();

server.get('/', (req,res) => {
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send('<h1>Hello</h1>');
});

server.listen(3000, () => {
    console.log('server en ecoute')
})