(function(){
    'use strict';

    angular.module('angularClientApp')
        .directive('localVideo', function () {
            return {
                scope:  {
                    'height'    : '@',
                    'width'     : '@',
                    'user'      : '=',
                    'onSuccess' : '=',
                    'onError'   : '&'
                },
                templateUrl : 'views/directives/local-video.html',
                restrict: 'E',
                link: function postLink(scope, element) {
                    scope.startMedia();
                    scope.videoElement = element.find('video')[0];

                },
                controller: function ($scope, $sce, $log) {
                    $scope.startMedia = function () {
                        $log.info('starting Media');
                        getMedia();
                    };

                    function getMedia () {
                        getUserMedia({video: true, audio: false}, function(localStream) {
                                $scope.$apply(function(){
                                    var fullStream = {};
                                    fullStream = localStream;
                                    localStream = URL.createObjectURL(localStream);
                                    $scope.user.stream = {};
                                    $scope.user.stream = $scope.trustSrc(localStream);

                                    if ($scope.onSuccess){
//                                        $scope.onSuccess({localStream: fullStream});
                                        $scope.onSuccess(fullStream);
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
                        $scope.videoElement.play();
                    };
                }
            };
        });

}());
