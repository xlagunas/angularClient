(function() {
    'use strict';

    angular.module('angularClientApp')
        .controller('ContactCtrl', function ($scope, $stateParams, $log,  $modal, UserService, _, WebsocketService) {
            $log.info('id:' +$stateParams.id);
            if ($stateParams.id === UserService.getSession()._id){
                $scope.user = UserService.getSession();
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
                $modal.open({
                    templateUrl: 'views/modals/callWaitingResponse.html',
                    controller: function($scope, $timeout, WebsocketService, $state) {
                        var promise = $timeout(function(){ $log.info('execute timeout');$scope.$dismiss();}, 25000, false);

                        $scope.cancel = function() {
                            $scope.$dismiss();
                            $timeout.cancel(promise);
                        };

                        WebsocketService.on('call:accept', function(msg){
                            $log.info(msg);
                            $timeout.cancel(promise);
                            $scope.$close(msg);
                            $state.go('main.conference', {id: msg._id});
                        });

                        WebsocketService.on('call:reject', function(msg){
                            $log.info('call:reject via WS');
                            $log.info(msg);
                            $timeout.cancel(promise);
                            $scope.$close(msg);
                        });
                    }
                })
                .result.then(function(result){
                    if (result !== null){
                        $log.info('retrieving result from WS');
                        $log.info(result);
                    }
                });
            };

            $scope.callConfirmation = function () {
                $modal.open({
                    templateUrl: 'views/modals/callConfirmation.html',
                    resolve: {
                        user: function() {
                            return $scope.user;
                        }
//                        constraints:
                    },
                    controller: function($scope, $log, user) {
                        $scope.user = user;
                        $scope.confirm = function() {
                            $scope.$close(true);
                        };
                        $scope.cancel = function() {
                            $scope.$dismiss();
                        };
                    }
                })
                .result.then(function(result){
                    if (result){
                        WebsocketService.emit('call:invite',{id: $scope.user._id, msg: {type: 'CREATE'}});
                        $scope.waitingResponseDialog();

                    }
                });
            };

        });

}());