(function() {
    'use strict';

    angular.module('angularClientApp')
        .controller('ContactCtrl', function ($scope, $stateParams, $log, UserService) {
            $scope.user = UserService.getSession();
            $log.info($scope.user);
        });

}());