(function() {
    'use strict';


    angular.module('angularClientApp')
    .directive('contactItem', ['$log', function ($log) {
        return {
            scope: {
                contact: '='
            },
            templateUrl: 'views/directives/contact-item.html',
            restrict: 'E',
            replace: 'true',
            controller: ['$scope', '$state', 'SERVER_URL', function ($scope, $state, SERVER_URL) {
                $scope.serverUrl = SERVER_URL;
                if ($scope.contact.status !== 'ONLINE'){
                    if ($scope.contact.isPhone) {
                        $scope.contact.status = 'MOBILE';
                        console.log('updating to mbile');
                    } else {
                        console.log('not updating to mobile');
                    }
                }

                console.log($scope.contact);

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
