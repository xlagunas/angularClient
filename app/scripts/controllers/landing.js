/*global angular*/
(function () {
    'use strict';

    angular.module('angularClientApp')
        .controller('LandingCtrl',['$scope', '$log', 'EventService' ,function ($scope, $log, EventService) {
            $scope.awesomeThings = [
                'HTML5 Boilerplate',
                'AngularJS',
                'Karma'
            ];
            $log.info('Entro al fill!');

            $scope.method();
        }]);
}());