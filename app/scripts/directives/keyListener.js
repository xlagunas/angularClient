(function() {
    'use strict';

    angular.module('angularClientApp')
        .directive('keyListener', function () {
        return  function postLink(scope, element, attrs) {
            element.bind('keyup', function(event){

                if (event.keyCode === parseInt(attrs.keyCode)){
                    scope.$apply(attrs.keyListener);
                }
            });
        };
    });

})();
