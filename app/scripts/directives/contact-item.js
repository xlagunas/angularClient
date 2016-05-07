(function() {
    'use strict';


    angular.module('angularClientApp')
    .directive('contactItem', ['$log', 'SERVER_URL', function ($log, SERVER_URL) {
        return {
            scope: {
                contact: '='
            },
            templateUrl: 'views/directives/contact-item.html',
            restrict: 'E',
            replace: 'true',
            controller: ['$scope', '$state', 'SERVER_URL', function ($scope, $state, SERVER_URL) {
                $log.info(SERVER_URL);
                $scope.displayContactInfo = function () {
                    $state.go('main.contact', {id: $scope.contact._id});
                };
                this.msg = function() {
                    $log.info('calling msg!');
                };
            }],
            link: function postLink (scope, element) {
                element.bind('mouseenter', function(){
                    element.css('cursor', 'pointer');
                });
            }
        };
    }]);
}());
