var express = require('express');
module.exports = function (app) {
    var letters = require('./controllers/letters_controller');
    var latex = require('./controllers/latex_controller');

    app.use('/static', express.static('./static'))
        .use('/lib', express.static( './lib'))
        .use('/views', express.static( './views'))
        .use('/bower_components', express.static( './bower_components'))
        .use('/controllers', express.static( './controllers'));
    app.get('/', function (req, res) {
        res.render('main');
    });

    app.get('/letter/get/pdfcounter', letters.getCounterPDF);
    app.post('/letter/get/pdf', letters.getPDF);
    app.post('/letter/get/latex', letters.getLatex);
    app.post('/latex/get/pdf', latex.getPDF);
};