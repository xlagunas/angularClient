'use strict';

angular.module('angularClientApp')
  .controller('LandingCtrl', function ($scope, $log) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
        $log.info("Entro al fill!")
  });
