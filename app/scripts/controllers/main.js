/*global angular*/
(function () {
    'use strict';

    angular.module('angularClientApp')
        .controller('MainCtrl', function ($scope, $state, $timeout, $log, $modal) {
            $log.info('Entro al main controller!');

            $scope.method = function () {
                $log.info('Crido al method');
            };

            $scope.button = function() {
                $modal.open({
                        templateUrl: 'views/modals/landing.html',
                        controller: ['$scope', function($scope) {
                            $scope.dismiss = function() {
                                $scope.$dismiss();
                            };

                            $scope.save = function() {
                                $scope.$close(true);
                            };
                        }]
                    })
                    .result.then(function(result) {
                        if (result) {
                            $state.go('main.secondary');
                        }
                    });
            };

        });

}());