(function() {
    'use strict';

    angular.module('angularClientApp')
        .directive('hover', function () {
            return  function postLink(scope, element, attrs) {
                element.bind('mouseenter', function(){
                    console.log('hover');
                    element.addClass(attrs.hover);
                });
                element.bind('mouseleave', function(){
                    element.removeClass(attrs.hover);
                });
                element.bind('click', function(){
                    element.addClass(attrs.hover);
                });
            };
        });

})();