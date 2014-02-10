'use strict';

angular.module('angularClientApp', [
  'ngCookies',
  'ngSanitize',
  'ui.router'
])
  .config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/main/landing');

        $stateProvider
            .state('main', {
                abstract: true,
                url: '/main',
                templateUrl: 'views/main.html',
                controller: 'MainCtrl'
            })
            .state('main.landing', {
                url: '/landing',
                templateUrl: 'views/landing.html',
                controller: 'LandingCtrl'
            })
            .state('main.secondary', {
                url: '/secondary',
                templateUrl: 'views/secondary.html',
                controller: 'SecondaryCtrl'
            })

  });
