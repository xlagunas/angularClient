(function() {
    'use strict';

    angular.module('angularClientApp')
        .factory('_', function () {
            return window._; // assumes underscore has already been loaded on the page
        });
}());