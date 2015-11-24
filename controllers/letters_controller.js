var mongoose = require('mongoose'),
    Statistics = mongoose.model("Statistics");

exports.getPDF = function(request, response) {

    var letter = request.body;

    parseLatexLetter(letter, function(letterData) {
        response.contentType("application/pdf");
        require("latex")([letterData]).pipe(response);
        console.log("Compiled LaTex document");
        Statistics.countUp();
    });
};

exports.getCounterPDF = function(request, response) {
    Statistics.totalCount(function(totalcount) {
        response.json({
            count: totalcount
        });
    });
};

exports.getLatex = function(request, response) {
    var letter = request.body;

    parseLatexLetter(letter, function(letterData) {
        response.send(letterData);
    });
};

parseLatexLetter = function(letter, success) {
    var fs = require('fs');

    // Open the existing notes file
    fs.readFile(__dirname + '/../resources/formalLetter.tex', 'utf8', function(error, data) {

        // If we get an error, log it and return
        if (error) {
            response.status(500).end();
            return console.log(error);
        }

        // Body
        letter.body.addressee = letter.body.addressee.replace(/\n/g, "\\\\");
        letter.body.enclosed = letter.body.enclosed.replace(/\n/g, "\\\\");

        data = data.replace('[[FROMNAME]]', letter.body.fromname);

        data = data.replace('[[FROMADDRESS]]', letter.body.fromaddress === '' ? '' : '\\setkomavar{fromaddress}{' + letter.body.fromaddress + '}');
        data = data.replace('[[FROMADDRESS]]', letter.body.fromaddress);
        data = data.replace('[[FROMPHONE_BOOL]]', letter.body.fromphone === '' ? 'off' : 'on');
        data = data.replace('[[FROMPHONE]]', letter.body.fromphone);
        data = data.replace('[[FROMEMAIL_BOOL]]', letter.body.fromemail === '' ? 'off' : 'on');
        data = data.replace('[[FROMEMAIL]]', letter.body.fromemail);
        data = data.replace('[[FROMURL_BOOL]]', letter.body.fromurl === '' ? 'off' : 'on');
        data = data.replace('[[FROMURL]]', letter.body.fromurl);
        data = data.replace('[[FROMFAX_BOOL]]', letter.body.fromfax === '' ? 'off' : 'on');
        data = data.replace('[[FROMFAX]]', letter.body.fromfax);
        data = data.replace('[[FROMBANK_BOOL]]', letter.body.frombank === '' ? 'off' : 'on');
        data = data.replace('[[FROMBANK]]', letter.body.frombank);

        data = data.replace('[[ADDRESSEE_BOOL]]', letter.body.addressee === '' ? 'off' : 'on');
        data = data.replace('[[ADDRESSEE]]', letter.body.addressee);

        data = data.replace('[[SUBJECT]]', letter.body.subject);
        data = data.replace('[[OPENING]]', letter.body.opening);
        data = data.replace('[[CLOSING]]', letter.body.closing);
        data = data.replace('[[SIGNATURE]]', letter.body.signature);

        data = data.replace('[[PS]]', letter.body.ps === '' ? '' : '\\ps{' + letter.body.ps + '}');
        data = data.replace('[[ENCLOSED]]', letter.body.enclosed == '' ? '' : '\\encl{' + letter.body.enclosed + '}');
        data = data.replace('[[CC]]', letter.body.cc === '' ? '' : '\\cc{' + letter.body.cc + '}');

        data = data.replace('[[TEXT]]', letter.body.text);

        // Reference line
        data = data.replace('[[YOURREF]]', letter.referenceLine.yourref);
        data = data.replace('[[YOURMAIL]]', letter.referenceLine.yourmail);
        data = data.replace('[[MYREF]]', letter.referenceLine.myref);
        data = data.replace('[[CUSTOMER]]', letter.referenceLine.customer);
        data = data.replace('[[INVOICE]]', letter.referenceLine.invoice);
        data = data.replace('[[PLACE]]', letter.referenceLine.place);
        data = data.replace('[[DATE]]', letter.referenceLine.date);

        // Layout
        data = data.replace('[[FONTSIZE]]', letter.layout.fontsize);
        data = data.replace('[[PAPER]]', letter.layout.paper);
        data = data.replace('[[FROMALIGN]]', letter.layout.fromalign);
        data = data.replace('[[FROMRULE]]', letter.layout.fromrule);
        data = data.replace('[[LANGUAGE]]', letter.layout.language);

        console.log("Parsed LaTex document");

        success(data);
    });
};