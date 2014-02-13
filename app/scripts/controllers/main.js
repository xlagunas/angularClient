/*global angular*/
(function () {
    'use strict';

    angular.module('angularClientApp')
        .controller('MainCtrl', function ($scope, $state, $timeout, $log, $modal, UserService) {
            $log.info('Entro al main controller!');

            $scope.toggleSideBar = function (sideBar) {
                $scope.visibleColumns[sideBar] = ! $scope.visibleColumns[sideBar];
                $log.info(sideBar +' '+ $scope.visibleColumns[sideBar]);

                if ($scope.visibleColumns.actions && $scope.visibleColumns.contacts ) {
                    $scope.mainContentSizeClass.value = 'col-lg-12 col-md-12';
                    $log.debug('Tots dos collapsed: true');
                }
                else if (!$scope.visibleColumns.actions && !$scope.visibleColumns.contacts) {
                    $scope.mainContentSizeClass.value = 'col-lg-8 col-md-8';
                    $log.debug('Tots dos collapsed: false');
                }
                else {
                    $scope.mainContentSizeClass.value = 'col-lg-10 col-md-10';
                    $log.debug('entra a 1 dels dos');
                }
            };

            $scope.mainContentSizeClass = {value: 'col-lg-10 col-md-10'};

            $scope.visibleColumns = {actions: false, contacts: true};

            $scope.userSession = UserService.getSession();

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

            $log.info($scope.userSession);

        });

}());