'use strict';

angular.module('angularClientApp')
  .controller('SecondaryCtrl', function ($scope, $log) {
    $log.info("Aquesta és el segon fill");
  });
