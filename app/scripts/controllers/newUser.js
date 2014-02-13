/*global angular*/
(function () {
    'use strict';

    angular.module('angularClientApp')
        .controller('NewUserCtrl', function ($scope) {
            $scope.awesomeThings = [
                'HTML5 Boilerplate',
                'AngularJS',
                'Karma'
            ];
        });
}());
