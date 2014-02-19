/*global angular*/
(function () {
    'use strict';

    angular.module('angularClientApp', [
        'ngCookies',
        'ngSanitize',
        'ui.router',
        'ui.bootstrap',
        'ui.calendar'
    ])
        .config(function ($stateProvider, $urlRouterProvider, $sceDelegateProvider, $sceProvider) {

            $urlRouterProvider.otherwise('/login');
            $stateProvider
                .state('main', {
                    abstract: true,
                    url: '/main',
                    templateUrl: 'views/main.html',
                    controller: 'MainCtrl'
                })
                .state('main.calendar', {
                    url:'/calendar',
                    templateUrl: 'views/calendar.html',
                    controller: 'CalendarCtrl'
                })
                .state('main.management', {
                    url:'/management',
                    templateUrl: 'views/management.html',
                    controller: 'ManagementCtrl'
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
                .state('main.search', {
                    url: '/search',
                    templateUrl: 'views/searchList.html',
                    controller: 'SearchListCtrl'
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

            $sceProvider.enabled(true);

            $sceDelegateProvider.resourceUrlWhitelist(['self', /^https?:\/\/(cdn\.)?vb2.i2cat.net/]);
        });
}());
