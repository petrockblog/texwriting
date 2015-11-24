angular.module('App')
    .controller('LetterController', ['$scope', 'LetterDocument', '$http', '$sce', '$mdDialog', 'BabelLanguages',
        function ($scope, LetterDocument, $http, $sce, $mdDialog, BabelLanguages) {
            $scope.letter = JSON.parse(JSON.stringify(LetterDocument));
            $scope.pdfUrl = '';
            $scope.numberPDFRequests = 0;
            $scope.doAutoUpdate = true;
            $scope.babelLanguages = BabelLanguages;

            $scope.getPDFFromLatex = function () {
                $scope.isPDFLoading = true;
                $scope.numberPDFRequests += 1;
                $http.post('https://texwriting.com/letter/get/pdf', $scope.letter, {
                    responseType: 'arraybuffer'
                }).
                    success(function (response) {
                        if ($scope.pdfBlob) {
                            delete $scope.pdfBlob;
                        }
                        $scope.pdfBlob = new Blob([response], {
                            type: 'application/pdf'
                        });
                        var fileURL = URL.createObjectURL($scope.pdfBlob);
                        $scope.pdfUrl = fileURL;
                        $scope.numberPDFRequests -= 1;
                    })
                    .error(function () {
                        $scope.numberPDFRequests -= 1;
                    });
            };

            $scope.downloadLatex = function () {
                $http.post('https://texwriting.com/letter/get/latex', $scope.letter)
                    .success(function (response) {
                        var latexData = new Blob([response], {type: "application/pdf;charset=utf-8"});
                        //var url = URL.createObjectURL(latexData);
                        saveAs(latexData, "MyLetter.tex");
                        delete latexData;
                    })
                    .error(function () {
                    });
            };

            $scope.downloadPDF = function () {
                saveAs($scope.pdfBlob, "MyLetter.pdf");
            };

            $scope.printPDF = function () {
                var printWindow = window.open($scope.pdfUrl);
                printWindow.document.close(); //missing code
                setTimeout(function () {
                    printWindow.focus();
                    printWindow.print();
                }, 500);
            };

            $scope.saveLetter = function () {
                data = JSON.stringify($scope.letter, undefined, 2);
                var blob = new Blob([data], {type: "text/json;charset=utf-8"});
                saveAs(blob, "MyLetter.json");
                delete blob;
            };

            $scope.loadLetter = function (ev) {
                $mdDialog.show({
                    controller: LoadLetterController,
                    templateUrl: '/static/loadLetterDialog.tmpl.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true
                })
                    .then(function (uploadedData) {
                        var letterSchema =
                        {
                            Type: "Object",
                            Attributes: [
                                {
                                    Name: "type",
                                    Type: "String"
                                },
                                {
                                    Name: "body",
                                    Type: "Object",
                                    Attributes: [
                                        {
                                            Name: "fromname",
                                            Type: "String"
                                        },
                                        {
                                            Name: "fromaddress",
                                            Type: "String"
                                        },
                                        {
                                            Name: "fromphone",
                                            Type: "String"
                                        },
                                        {
                                            Name: "fromemail",
                                            Type: "String"
                                        },
                                        {
                                            Name: "fromfax",
                                            Type: "String"
                                        },
                                        {
                                            Name: "fromurl",
                                            Type: "String"
                                        },
                                        {
                                            Name: "frombank",
                                            Type: "String"
                                        },
                                        {
                                            Name: "addressee",
                                            Type: "String"
                                        },
                                        {
                                            Name: "subject",
                                            Type: "String"
                                        },
                                        {
                                            Name: "opening",
                                            Type: "String"
                                        },
                                        {
                                            Name: "text",
                                            Type: "String"
                                        },
                                        {
                                            Name: "closing",
                                            Type: "String"
                                        },
                                        {
                                            Name: "signature",
                                            Type: "String"
                                        },
                                        {
                                            Name: "ps",
                                            Type: "String"
                                        },
                                        {
                                            Name: "enclosed",
                                            Type: "String"
                                        },
                                        {
                                            Name: "cc",
                                            Type: "String"
                                        }
                                    ]
                                },
                                {
                                    Name: "referenceLine",
                                    Type: "Object",
                                    Attributes: [
                                        {
                                            Name: "yourref",
                                            Type: "String"
                                        },
                                        {
                                            Name: "yourmail",
                                            Type: "String"
                                        },
                                        {
                                            Name: "myref",
                                            Type: "String"
                                        },
                                        {
                                            Name: "customer",
                                            Type: "String"
                                        },
                                        {
                                            Name: "invoice",
                                            Type: "String"
                                        },
                                        {
                                            Name: "place",
                                            Type: "String"
                                        },
                                        {
                                            Name: "date",
                                            Type: "String"
                                        }
                                    ]
                                },
                                {
                                    Name: "layout",
                                    Type: "Object",
                                    Attributes: [
                                        {
                                            Name: "fontsize",
                                            Type: "String"
                                        },
                                        {
                                            Name: "paper",
                                            Type: "String"
                                        },
                                        {
                                            Name: "language",
                                            Type: "String"
                                        },
                                        {
                                            Name: "fromalign",
                                            Type: "String"
                                        },
                                        {
                                            Name: "fromrule",
                                            Type: "String"
                                        }
                                    ]
                                }
                            ]
                        };
                        var jsd_validator = new JSDValidator({Schema: letterSchema});

                        var result = true;
                        try {
                            uploadedData = JSON.parse(uploadedData);
                            result = jsd_validator.Validate(uploadedData);
                        } catch (e) {
                            result = false;
                        }

                        if (result) {
                            $scope.letter = uploadedData;
                            $scope.getPDFFromLatex();
                        } else {
                            var dialog = $mdDialog.alert()
                                .title('Invalid data')
                                .content('The data that you provided is not valid. You can use the "Save Letter" button to get valid letter data.')
                                .ariaLabel('The data that you provided is not valid.')
                                .ok('OK');
                            $mdDialog.show(dialog);
                        }

                    }, function () {
                        // dialog cancelled
                    });
            };

            $scope.getPDFFromLatex();

        }
    ]);

function LoadLetterController($scope, $mdDialog) {
    $scope.inputData = '';

    $scope.hide = function () {
        $mdDialog.hide();
    };
    $scope.cancel = function () {
        $mdDialog.cancel();
    };
    $scope.answer = function (answer) {
        $mdDialog.hide(answer);
    };
}

