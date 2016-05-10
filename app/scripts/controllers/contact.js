(function() {
    'use strict';

    angular.module('angularClientApp')
        .controller('ContactCtrl', ['$scope', '$stateParams', '$log', '$modal', '$mdDialog', 'UserService','_','WebsocketService',
        function ($scope, $stateParams, $log,  $modal, $mdDialog, UserService, _, WebsocketService) {
            $log.info('id:' +$stateParams.id);

            if ($stateParams.id === UserService.getSession()._id || $stateParams.id === null || $stateParams.id === ''){
                $scope.user = UserService.getSession();
                console.log($scope.user);
            }
            else {
                $scope.user = _.find(UserService.getUsers().accepted, function(user){return (user._id === $stateParams.id);});
            }

            $scope.createEvent = function () {
                var event = {};
                event.type = 'createWithContact';
                event.addedUsers = [];
                event.addedUsers.push($scope.user);
                $log.info(event);

                $modal.open({
                    templateUrl: 'views/modals/addCalendarEvent.html',
                    controller: 'CreateEventCtrl',
                    resolve: {
                        event: function() {
                            return event;
                        }
                    }
                })
                    .result.then(function(result) {
                        if (result) {
//                        Create should never be called in that method!
                            if (result.type === 'create'){
                                result.start = result.start -result.start.getTimezoneOffset()*60000;
                                $log.info(result);
                                WebsocketService.emit('calendar:createEvent', result);
                            }
                            else if (result.type === 'delete'){
                                $log.info('entra al delete');
                                $log.info(result);
                                WebsocketService.emit('calendar:removeUser', {id: result._id});
                            }
                        }
                        else{
                            $log.info('no result');
                        }
                    });
            };

            $scope.waitingResponseDialog = function () {
                $mdDialog.show({
                    templateUrl: 'views/modals/callWaitingResponse.html',
                    parent: angular.element(document.body),
                    clickOutsideToClose:true,
                    controller: function($scope, $mdDialog, $timeout, WebsocketService, $state) {
                        var promise = $timeout(function(){
                            $log.info('execute timeout');
                            $mdDialog.cancel();
                        }, 25000, false);

                        $scope.cancel = function() {
                            $mdDialog.cancel();
                            $timeout.cancel(promise);
                        };

                        WebsocketService.on('call:accept', function(msg){
                            $log.info(msg);
                            $timeout.cancel(promise);
                            $mdDialog.hide(msg);
                            $state.go('main.conference', {id: msg._id});
                        });

                        WebsocketService.on('call:reject', function(msg){
                            $log.info('call:reject via WS');
                            $log.info(msg);
                            $timeout.cancel(promise);
                            $mdDialog.hide(msg);
                        });
                    }
                })
                .then(function(result){
                    if (result !== null){
                        $log.info('retrieving result from WS');
                        $log.info(result);
                    }
                });
            };

            $scope.callConfirmation = function (ev) {
                $mdDialog.show({
                        templateUrl: 'views/modals/callConfirmation.html',
                        parent: angular.element(document.body),
                        targetEvent: ev,
                        clickOutsideToClose:true,
                        fullscreen: false,
                        resolve: {
                            user: function() {
                                return $scope.user;
                            }
                        },
                        controller: function ($scope, $mdDialog, $log, user) {
                            $scope.user = user;

                            $scope.answer = function(answer) {
                                $mdDialog.hide(answer)
                            };

                            $scope.cancel = function() {
                                $mdDialog.cancel();
                            };
                        },
                    })
                    .then(function() {
                        WebsocketService.emit('call:invite',{id: $scope.user._id, call: {type: 'CREATE'}});
                        $scope.waitingResponseDialog();
                    });
            };
        }]);

}());