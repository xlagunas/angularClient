/*global angular*/
(function () {
    'use strict';

    angular.module('angularClientApp', [
        'ngCookies',
        'ngSanitize',
        'ui.router',
        'ui.bootstrap'
    ])
        .config(function ($stateProvider, $urlRouterProvider, $sceDelegateProvider) {

            $urlRouterProvider.otherwise('/login');
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
                .state('login', {
                    url: '/login',
                    templateUrl: 'views/login.html',
                    controller: 'LoginCtrl'
                })
                .state('newUser', {
                    url: '/create',
                    templateUrl: 'views/newUser.html',
                    controller: 'NewUserCtrl'
                });

            $sceDelegateProvider.resourceUrlWhitelist(['self', /^https?:\/\/(cdn\.)?vb2.i2cat.net/]);
        });
}());
