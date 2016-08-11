(function() {
    'use strict';

    angular.module('angularClientApp')
        .controller('ConferenceCtrl', ['$scope', '$log', '$stateParams', 'WebsocketService', 'UserService', '$modal','$state','SERVER_URL',
        function ($scope, $log, $stateParams, WebsocketService, UserService, $modal, $state, SERVER_URL) {
            $scope.speakers = [];
            $scope.localSpeaker = UserService.getSession();
            $scope.conference = {id: $stateParams.id};
            $scope.chatMessages = [];
            $scope.serverUrl = SERVER_URL;

            $scope.onDropFile = function(file){
                $log.log('dropFile in controller received!');
                $scope.$broadcast('fileMessage', file);
            };

            $scope.sendMessage = function(message) {
                $log.log('From Controller');
                $log.log(message);
                $log.log(UserService.getSession());
                var newMessage = {};
                newMessage.type = 'chat';
                newMessage.text = message;
                newMessage.user = UserService.getSession().name +
                    ' '+ UserService.getSession().firstSurname + ' ' +
                    UserService.getSession().firstSurname;
                newMessage.image = UserService.getSession().thumbnail;
                newMessage.textAlign = 'text-right';
                newMessage.imagePos = 'pull-right';
                $scope.$broadcast('chatMessage', newMessage);
                $scope.chatMessages.push(newMessage);

            };

            $scope.rcvMessage = function(message) {
                $log.log('receive message from datachannel');
                $scope.$apply(function(){
                    $scope.chatMessages.push(message);
                });

                $log.log($scope.chatMessages);
            };


            $scope.onSuccess = function(localStream) {
                $log.info('Entro al onSuccess!!!!');
                UserService.setLocalStream(localStream);
                $log.log("is user conferencing? "+UserService.isConferencing());
                if (!UserService.isConferencing()){
                    WebsocketService.emit('call:register', {id: $stateParams.id});
                    //UserService.setConferencing({id: $stateParams.id});
                    UserService.setConferencing(true);
                }

            };

            $scope.onError = function() {
                $log.info('Entro al onError :(:(:(');
            };

            //This message brings us data about a new user which just connected the room.
            //we send back a message to the server telling him to notify this new user about our own data
            //In addition, we will be the offer creators with this user
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

            //This message is received for every connected user in the conference room. It gives us
            //information about who is the user behind that connection.
            //In addition, we will be the answer creators with this user.
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
                        $scope.$apply();
                    }
                }
                $log.log('total speakers length: ' +$scope.speakers.length);
                if ($scope.speakers.length === 0){
                    $scope.exitConference();
                }
            };

            $scope.exitConference = function() {
                $log.log('exitConference');
                WebsocketService.emit('call:unregister', {id: $stateParams.id});
                UserService.setConferencing(false);
                $scope.$broadcast('finish', {});
                $state.go('main.landing');
            };

            $scope.shareDesktop = function () {
                UserService.setConstraints({video: { mandatory: { chromeMediaSource: 'screen'}}, audio: false });
                WebsocketService.emit('call:unregister', {id: $stateParams.id});
                $scope.$broadcast('finish', {});
                $state.transitionTo($state.current, $stateParams, { reload: true, inherit: false, notify: true });

            };

            $scope.shareVideo = function () {
                UserService.setConstraints({video: true, audio: false });
                WebsocketService.emit('call:unregister', {id: $stateParams.id});
                $scope.$broadcast('finish', {});
                $state.transitionTo($state.current, $stateParams, { reload: true, inherit: false, notify: true });

            };

            $scope.$on('navBarEvent', function(data){
                $log.log(data);
            });

        }]);

}());
