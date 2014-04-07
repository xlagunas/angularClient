(function(){
    'use strict';

    angular.module('angularClientApp')
        .directive('localVideo', function () {
            return {
                scope:  {
                    'height'        : '@',
                    'width'         : '@',
                    'user'          : '=',
                    'onSuccess'     : '=',
                    'onError'       : '&',
                    'constraints'   : '='
                },
                templateUrl : 'views/directives/local-video.html',
                restrict: 'E',
                link: function postLink(scope, element) {
//                    scope.startMedia();
                    scope.videoElement = element.find('video')[0];

                },
                controller: ['$scope', '$sce', '$log', 'UserService', function ($scope, $sce, $log, UserService) {
                    var fullStream = {};

                    $scope.$watch('constraints', function(){
                        $log.log('from directive constraints');
                        $log.log($scope.constraints);
                        if ($scope.constraints){
                            $scope.startMedia();
                        }
                    });

                    $scope.startMedia = function () {
                        $log.info('starting Media');
                        if (!UserService.isConferencing()){
                            getMedia();
                        } else{
                            $log.debug('no entra al getMedia()');
                            $scope.user.stream = $scope.trustSrc(UserService.getLocalStream());
                            $scope.resume();
                        }
                    };

                    function getMedia () {
                        getUserMedia($scope.constraints, function(localStream) {
                                $scope.$apply(function(){
                                    localStream.onended = function () {
                                        UserService.setConferencing();
                                    }

                                    fullStream = localStream;
                                    if (!$scope.constraints.video.mandatory){
                                        localStream = URL.createObjectURL(localStream);
                                        $scope.user.stream = {};
                                        $scope.user.stream = $scope.trustSrc(localStream);
                                    }

                                    if ($scope.onSuccess){
                                        $scope.onSuccess(fullStream);
                                        $scope.resume();

                                    }
                                });
                            }, function (error) {
                                $log.error('webrtc error');
                                $log.error(error);
                                if ($scope.onError){
                                    $scope.onError();
                                }
                            }
                        );

                    }

                    $scope.trustSrc = function(src) {
                        return $sce.trustAsResourceUrl(src);
                    };

                    $scope.resume = function () {
                        $log.info('resume localVideo');
                        $scope.videoElement.play();
                    };

                    $scope.pause = function () {
                        $scope.videoElement.pause();
                    };

                    $scope.$on('finish', function (){
                        $log.info('Closing localStream');
                        URL.revokeObjectURL($scope.user.stream);
                        fullStream.stop();
                        $scope.videoElement.src = null;
                        UserService.setConferencing(null);
                    });
                }]
            };
        });

}());
