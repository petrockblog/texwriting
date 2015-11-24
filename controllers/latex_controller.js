exports.getPDF = function (request, response) {

    var latexData = request.body;

    response.contentType("application/pdf");
    require("latex")([latexData.text]).pipe(response);
    console.log("Compiled LaTex document");
};

