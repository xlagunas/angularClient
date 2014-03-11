(function() {
    'use strict';


    angular.module('angularClientApp')
    .directive('contactItem', function ($log) {
        return {
            scope: {
                contact: '='
            },
            templateUrl: 'views/directives/contact-item.html',
            restrict: 'E',
            replace: 'true',
            controller: function ($scope, $state) {
                $scope.displayContactInfo = function () {
                    $state.go('main.contact', {id: $scope.contact._id});
                };
            },
            link: function postLink (scope, element) {
                element.bind('mouseenter', function(){
                    element.css('cursor', 'pointer');
                });
            }
        };
    });
}());
