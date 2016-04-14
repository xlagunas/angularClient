(function(){
    'use strict';

    angular.module('angularClientApp')
        .directive('photo', function () {
        return {
            scope:  {
                'image' : '=',
                'height' : '@',
                'width' : '@'
            },
            templateUrl : 'views/directives/photo.html',
            restrict: 'E',
            link: function postLink(scope, element) {
//                scope.startMedia();
                scope.videoElement = element.find('video')[0];
                scope.canvas = element.find('canvas')[0];
                var img = new Image();
                img.onload = function(){
                    var context = scope.canvas.getContext('2d');
                    context.drawImage(img,0,0);
                    scope.image = scope.canvas.toDataURL('image/png');
                };
                img.src = '/images/profile.png';

            },
            controller: ['$scope', '$sce', '$log', function ($scope, $sce, $log) {
                $scope.reload = false;

                $scope.startMedia = function () {
                    getMedia();
                };

                function getMedia () {
                    getUserMedia({video: true, audio: false}, function(localStream) {
                        $scope.$apply(function(){
                            localStream = URL.createObjectURL(localStream);
                            $scope.stream = $scope.trustSrc(localStream);
                        });
                    }, function (error) {
                            $log.error('webrtc error');
                            $log.error(error);
                        }
                    );

                }

                $scope.trustSrc = function(src) {
                    return $sce.trustAsResourceUrl(src);
                };

                $scope.pause = function () {
                    if (!$scope.stream) {
                        $log.info('creating stream');
                        $scope.startMedia();
                    }
                    else{
                        $scope.videoElement.pause();
                        $scope.reload = !$scope.reload;

                        var context = $scope.canvas.getContext('2d');
                        context.drawImage($scope.videoElement, 0, 0, $scope.videoElement.width, $scope.videoElement.height);
                        $scope.image = $scope.canvas.toDataURL('image/png');
                    }

                };

                $scope.resume = function () {
                        $scope.videoElement.play();
                        $scope.reload = !$scope.reload;
                };

                $scope.displayReadFile = function () {
                    $scope.reload = true;
                    $log.info($scope.image);
                    var img = new Image();
                    img.onload = function(){
                        var context = $scope.canvas.getContext('2d');
                        context.drawImage(img,0,0);
                        $scope.image = $scope.canvas.toDataURL('image/jpeg');
                    };
                    img.src = $scope.image;
                };


            }]
        };
    });

}());
