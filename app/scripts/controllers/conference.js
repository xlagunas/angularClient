(function() {
    'use strict';

    angular.module('angularClientApp')
        .controller('ConferenceCtrl', ['$scope', '$log', '$stateParams', 'WebsocketService', 'UserService', '$modal','$state',
        function ($scope, $log, $stateParams, WebsocketService, UserService, $modal, $state) {
            $scope.speakers = [];
            $scope.localSpeaker = UserService.getSession();
            $scope.conference = {id: $stateParams.id};
//            $scope.toggleSideBar('contacts');


            (function(){
                $modal.open({
                    templateUrl: 'views/modals/videoSource.html',
                    controller: function($scope) {
                        $scope.setSource = function(source){
                            $scope.$close(source);
                        };
                    }
                }).result.then(function(success){
                    if (success){
                        if (success === 'desktop'){
                            $log.info('desktop constraints');
                            $scope.constraints = {
                                video: { mandatory: { chromeMediaSource: 'screen'}},
                                audio: true
                            };
                        }
                        else if (success === 'camera') {
                            $log.info('video constraints');
                            $scope.constraints = {
                                video: true,
                                audio: true
                            };
                        }
                        $log.log($scope.constraints);
                    }
                });
            })();

            $scope.onSuccess = function(localStream) {
                $log.info('Entro al onSuccess!!!!');
                UserService.setLocalStream(localStream);
                if (!UserService.isConferencing()){
                    WebsocketService.emit('call:register', {id: $stateParams.id});
                    UserService.setConferencing({id: $stateParams.id});
                }

            };

            $scope.onError = function() {
                $log.info('Entro al onError :(:(:(');
            };

            WebsocketService.on('call:addUser', function (user){
                $log.info('new User added to conference');
                $log.info(user);
                WebsocketService.emit('call:userDetails', {idCall: $stateParams.id, idUser: user.id});

                //In the directive will look at this field to create an offer or wait for one
                user.createOffer = true;
                $scope.speakers.push(user);

            });

            WebsocketService.on('call:removeUser', function (user){
                $scope.$broadcast('exit', user);
            });

            WebsocketService.on('call:userDetails', function (user){
                $log.info('call to userDetails');
                $log.info(user);
                user.createOffer = false;
                $scope.speakers.push(user);
            });

            $scope.closeStream = function (username) {
                console.log('Calling closeStream in conference');
                for (var i=$scope.speakers.length-1;i>=0;i--){
                    if ($scope.speakers[i].username === username){
                        $log.log('speaker found');
                        $scope.speakers.splice(i,1);
                    }
                }
            };

            $scope.exitConference = function() {
                $log.log('exitConference');
                WebsocketService.emit('call:unregister', {id: $stateParams.id});
                $scope.$broadcast('finish', {});
//                $state.go('main.landing');
                $state.transitionTo($state.current, $stateParams, { reload: true, inherit: false, notify: true });
            };

        }]);

}());
