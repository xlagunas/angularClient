/*global angular*/
(function () {
    'use strict';

    angular.module('angularClientApp')
        .controller('LandingCtrl',['$scope', '$log', 'EventService', 'SERVER_URL' ,function ($scope, $log, EventService, SERVER_URL) {
            $scope.awesomeThings = [
                'HTML5 Boilerplate',
                'AngularJS',
                'Karma'
            ];
            $log.info('Entro al fill!');

            $scope.method();

            $scope.serverUrl = SERVER_URL;
            $scope.drop = function (file) {
                console.log(file);
            };
        }]);
}());
