//(function(){
//    'use strict';
//
//    angular.module('angularClientApp')
//        .controller('NewEventCtrl', function ($scope) {
//            $scope.today = function() {
//                $scope.dt = new Date();
//            };
//            $scope.today();
//
//            $scope.showWeeks = true;
//            $scope.toggleWeeks = function () {
//                $scope.showWeeks = ! $scope.showWeeks;
//            };
//
//            $scope.clear = function () {
//                $scope.dt = null;
//            };
//
//            $scope.toggleMin = function() {
//                $scope.minDate = ( $scope.minDate ) ? null : new Date();
//            };
//            $scope.toggleMin();
//
//            $scope.open = function($event) {
//                $event.preventDefault();
//                $event.stopPropagation();
//
//                $scope.opened = true;
//            };
//
//            $scope.dateOptions = {
//                'year-format': '\'yy\'',
//                'starting-day': 1
//            };
//
//            $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'shortDate'];
//            $scope.format = $scope.formats[0];
//        });
//}());
