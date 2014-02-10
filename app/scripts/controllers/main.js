'use strict';

angular.module('angularClientApp')
  .controller('MainCtrl', function ($scope, $log, $state, $timeout) {
    $log.info("Entro al main controller!");

        $timeout(function() {
            $log.info("derrerd callback!")
            $state.go('main.secondary');
        }, 4000);

        $timeout(function() {
            $log.info("derrerd callback!")
            $state.go('main.landing');
        }, 8000);

        $timeout(function() {
            $log.info("derrerd callback!")
            $state.go('main.secondary');
        }, 12000);

        $timeout(function() {
            $log.info("derrerd callback!")
            $state.go('main.landing');
        }, 16000);
  });
