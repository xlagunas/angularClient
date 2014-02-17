(function(){
    'use strict';

    angular.module('angularClientApp')
        .directive('photo', function () {
        return {
            scope:  {
                'image' : '='
            },
            templateUrl : 'views/directives/photo.html',
            restrict: 'E',
            link: function postLink(scope, element, attrs) {
                scope.startMedia();
            },
            controller: function ($scope, $sce, $log) {

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
            }
        };
    });

}());
