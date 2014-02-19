/*global angular*/
(function () {
    'use strict';

    angular.module('angularClientApp')
        .controller('MainCtrl', function ($scope, $state, $timeout, $log, $modal, UserService, WebsocketService) {
            $log.info('Entro al main controller!');

            $scope.contactList = {loaded: false};
            $scope.visibleColumns = {actions: false, contacts: false};
            $scope.mainContentSizeClass = {value: 'col-lg-8 col-md-8'};
            $scope.userTextBox = {};

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

            $scope.userSession = UserService.getSession();
            $scope.userContacts = UserService.getUsers();

            $scope.method = function () {
                $log.info('Crido al method');
            };

            $scope.findContacts = function () {
                WebsocketService.emit('contacts:find', $scope.userTextBox, function(data){
                    $scope.foundUsers = data;
                    console.log(data);
                    $state.transitionTo('main.search');
                });
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

            $scope.toggleContacts = function () {
                $log.debug($scope.contactList);
                $scope.contactList.loaded = true;
            };
            $log.info(UserService.getSession());
            $log.info(UserService.getUsers());

//                 COMENTAT PER A EVITAR QUE EL SERVIDOR PETI AL REINICAR VISTA

            WebsocketService.emit('contacts:list','', function(contacts){
                $log.debug('entro al contacts:list');
                $log.debug(contacts);
                if (contacts){
                    Object.keys(contacts).forEach(function(key){
                        $log.info(key);
                        UserService.addUsers(key, contacts[key]);
                    });
                    $scope.contactList.loaded = true;
                }
            });

            WebsocketService.on('contacts:update', function(contacts){
                $log.info(contacts);
                Object.keys(contacts).forEach(function(key){
                    $log.info(key);
                    UserService.addUsers(key, contacts[key]);
                });
            });

        });

}());