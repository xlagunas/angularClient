(function() {
    'use strict';

    angular.module('angularClientApp')
        .directive('autoScroll', function () {
            return {
                restrict: 'A',
                link: function postLink(scope, element, attrs) {
                    scope.$watch(attrs.autoScroll, function () {
                        element[0].scrollTop = element[0].scrollHeight;
                    }, true);
                }
            };
        });

})();