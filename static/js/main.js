angular.module('App', ['ngMaterial', 'ngStorage', 'pdf', 'ngAdsense', 'ngMessages', 'ngAnimate', 'ngAria',
    'angularUtils.directives.dirDisqus', 'angularUtils.directives.dirTerminalType',
    'angular-google-analytics'
])

.config(function($mdThemingProvider, $locationProvider, AnalyticsProvider) {
    $mdThemingProvider
        .theme('default')
        .primaryPalette('blue-grey')
        .accentPalette('grey')
        .warnPalette('grey')
        .backgroundPalette('blue-grey');

    $locationProvider.html5Mode(true);
    $locationProvider.hashPrefix('!');

    AnalyticsProvider.setAccount('UA-70102973-1');  // sets the Google Adsense account ID
})

.controller('MainController', ['$scope', '$http',
    function MainController($scope, $http) {

        $scope.content = '/static/home.html';

        $scope.letterpdfcount = 0;

        $http.get('https://texwriting.com/letter/get/pdfcounter')
            .success(function(response) {
                $scope.letterpdfcount = response.count;
            })
            .error(function() {});

        /**
         * @brief Sets the scope variable "content" that points to the template 
         * that should be viewed.
         * @param filename - The name of the file within the subfolder 'static'
         */
        $scope.setContent = function(filename) {
            $scope.content = '/static/' + filename;
        };

        var originatorEv;
        this.openMenu = function($mdOpenMenu, ev) {
            originatorEv = ev;
            $mdOpenMenu(ev);
        };

    }
])

.directive('ngChangeOnBlur', function() {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, elm, attrs, ngModelCtrl) {
            if (attrs.type === 'radio' || attrs.type === 'checkbox')
                return;

            var expressionToCall = attrs.ngChangeOnBlur;

            var oldValue = null;
            elm.bind('focus', function() {
                scope.$apply(function() {
                    oldValue = elm.val();
                    console.log(oldValue);
                });
            })
            elm.bind('blur', function() {
                scope.$apply(function() {
                    var newValue = elm.val();
                    console.log(newValue);
                    if (newValue != oldValue) {
                        scope.$eval(expressionToCall);
                    }
                    //alert('changed ' + oldValue);
                });
            });
        }
    };
})

/**
 * @brief Generates a GUID
 * @return A GUID in the form xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
 */
.factory('GUID', ['', function() {
    var guid = '';

    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}])

/**
 * @brief Default default letter factory
 * @return A default letter document
 */
.factory('LetterDocument', function() {
    var letterDocument = {
        type: 'letter',
        body: {
            fromname: 'John Smith',
            fromaddress: 'My Street 123, 12345 Mytown',
            fromphone: '',
            fromemail: '',
            fromfax: '',
            fromurl: '',
            frombank: '',
            addressee: '',
            subject: 'The subject',
            opening: 'Dear Mrs. or Mr., ',
            text: 'this is the text that I always wanted to write.',
            closing: 'With Best Regards,',
            signature: 'J. Smith',
            ps: '',
            enclosed: '',
            cc: ''
        },
        referenceLine: {
            yourref: '',
            yourmail: '',
            myref: '',
            customer: '',
            invoice: '',
            place: '',
            date: ''
        },
        layout: {
            fontsize: '12pt',
            paper: 'a4',
            language: 'english',
            fromalign: 'center',
            fromrule: 'aftername'
        }
    };

    return letterDocument;
})

.factory('LatexDocument', function() {
    var latexDocument = {
        type: 'latex',
        text: '\\documentclass{article}\n\n\\begin{document}\n\n\\title{Introduction to \\LaTeX{}}\n\\author{Author\'s Name}\n\n\\maketitle\n\n\\begin{abstract}\nThe abstract text goes here.\n\\end{abstract}\n\n\\section{Introduction}\nHere is the text of your introduction.\n\n\\begin{equation}\n    \\label{simple_equation}\n    \\alpha = \\sqrt{ \\beta }\n\\end{equation}\n\n\\subsection{Subsection Heading Here}\nWrite your subsection text here.\n\n\\section{Conclusion}\nWrite your conclusion here.\n\n\\end{document}\n'
    };

    return latexDocument;
})

.factory('BabelLanguages', function() {
    return [{
        "name": 'acadian',
        "value": 'acadian'
    }, {
        "name": 'american',
        "value": 'american'
    }, {
        "name": 'australian',
        "value": 'australian'
    }, {
        "name": 'austrian',
        "value": 'austrian'
    }, {
        "name": 'bahasa',
        "value": 'bahasa'
    }, {
        "name": 'bahasai',
        "value": 'bahasai'
    }, {
        "name": 'bahasam',
        "value": 'bahasam'
    }, {
        "name": 'basque',
        "value": 'basque'
    }, {
        "name": 'brazil',
        "value": 'brazil'
    }, {
        "name": 'brazilian',
        "value": 'brazilian'
    }, {
        "name": 'breton',
        "value": 'breton'
    }, {
        "name": 'british',
        "value": 'british'

    }, {
        "name": 'bulgarian',
        "value": 'bulgarian'
    }, {
        "name": 'canadian',
        "value": 'canadian'
    }, {
        "name": 'canadien',
        "value": 'canadien'
    }, {
        "name": 'catalan',
        "value": 'catalan'
    }, {
        "name": 'croatian',
        "value": 'croatian'
    }, {
        "name": 'czech',
        "value": 'czech'
    }, {
        "name": 'danish',
        "value": 'danish'
    }, {
        "name": 'dutch',
        "value": 'dutch'
    }, {
        "name": 'english',
        "value": 'english'
    }, {
        "name": 'esperanto',
        "value": 'esperanto'
    }, {
        "name": 'estonian',
        "value": 'estonian'
    }, {
        "name": 'finnish',
        "value": 'finnish'
    }, {
        "name": 'francais',
        "value": 'francais'
    }, {
        "name": 'french',
        "value": 'french'
    }, {
        "name": 'galician',
        "value": 'galician'
    }, {
        "name": 'german',
        "value": 'german'
    }, {
        "name": 'germanb',
        "value": 'germanb'
    }, {
        "name": 'greek',
        "value": 'greek'
    }, {
        "name": 'hebrew',
        "value": 'hebrew'
    }, {
        "name": 'icelandic',
        "value": 'icelandic'
    }, {
        "name": 'indon',
        "value": 'indon'
    }, {
        "name": 'indonesian',
        "value": 'indonesian'
    }, {
        "name": 'interlingua',
        "value": 'interlingua'
    }, {
        "name": 'irish',
        "value": 'irish'
    }, {
        "name": 'italian',
        "value": 'italian'
    }, {
        "name": 'latin',
        "value": 'latin'
    }, {
        "name": 'lowersorbian',
        "value": 'lowersorbian'
    }, {
        "name": 'malay',
        "value": 'malay'
    }, {
        "name": 'melayu',
        "value": 'melayu'
    }, {
        "name": 'naustrian',
        "value": 'naustrian'
    }, {
        "name": 'ngerman',
        "value": 'ngerman'
    }, {
        "name": 'norsk',
        "value": 'norsk'
    }, {
        "name": 'nynorsk',
        "value": 'nynorsk'
    }, {
        "name": 'polish',
        "value": 'polish'
    }, {
        "name": 'polutonikogreek',
        "value": 'polutonikogreek'
    }, {
        "name": 'portuges',
        "value": 'portuges'
    }, {
        "name": 'portuguese',
        "value": 'portuguese'
    }, {
        "name": 'romanian',
        "value": 'romanian'
    }, {
        "name": 'russian',
        "value": 'russian'
    }, {
        "name": 'samin',
        "value": 'samin'
    }, {
        "name": 'scottish',
        "value": 'scottish'
    }, {
        "name": 'serbian',
        "value": 'serbian'
    }, {
        "name": 'slovak',
        "value": 'slovak'
    }, {
        "name": 'slovene',
        "value": 'slovene'
    }, {
        "name": 'spanish',
        "value": 'spanish'
    }, {
        "name": 'swedish',
        "value": 'swedish'
    }, {
        "name": 'turkish',
        "value": 'turkish'
    }, {
        "name": 'UKenglish',
        "value": 'UKenglish'
    }, {
        "name": 'ukrainian',
        "value": 'ukrainian'
    }, {
        "name": 'uppersorbian',
        "value": 'uppersorbian'
    }, {
        "name": 'USenglish',
        "value": 'USenglish'
    }, {
        "name": 'welsh',
        "value": 'welsh'
    }];
})
;