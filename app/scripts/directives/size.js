(function() {
    'use strict';

    angular.module('angularClientApp')
        .directive('size', function () {
            return function (scope, element){
                scope.elementSize = {width: element.width(), height: element.height()};

                scope.$watch
                (
                    function () {
                        return {
                            w:element.width(),
                            h:element.height()
                        };
                    },
                    function (newValue) {
                        if (scope.elementSize.height === 0 || scope.elementSize.height === null){
                            scope.elementSize.height = newValue.h;
                        }
                        scope.elementSize.width = newValue.w;
                        console.log(scope.elementSize);
                    },
                    true
                );

//                element.bind('resize', function() {
//                    scope.$apply();
//                    console.log('resize triggered');
//                });
            };
        });
}());
//    angular.module('angularClientApp')
//        .directive('size', function () {
//            return function (scope, element){
//                scope.elementSize = {width: element.width()+'px', height: element.height() +'px'};
//
//                scope.$watch
//                (
//                    function () {
//                        return {
//                            w:element.width(),
//                            h:element.height()
//                        };
//                    },
//                    function (newValue) {
//                        console.log(newValue);
//                        scope.elementSize.width = newValue.w + 'px';
//                        scope.elementSize.height = newValue.h + 'px';
//                        console.log(scope.elementSize);
//                    },
//                    true
//                );
//
//                element.bind('resize', function() {
//                    scope.$apply();
//                    console.log('resize triggered');
//                });
//            };
//        });
//}());
