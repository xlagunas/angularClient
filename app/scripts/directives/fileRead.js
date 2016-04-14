(function(){
    'use strict';

    angular.module('angularClientApp')
        .directive('fileread', [function () {
            return {
                scope: false,
                link: function (scope, element) {
                    console.log('readFile');
                    element.bind('change', function (changeEvent) {
                        var reader = new FileReader();
                        reader.onload = function (loadEvent) {
                            scope.$apply(function () {
                                console.log(loadEvent);
                                scope.image = loadEvent.target.result;
                                scope.displayReadFile();
                            });
                        };
                        reader.readAsDataURL(changeEvent.target.files[0]);
                    });
                }
            };
        }]);
}());