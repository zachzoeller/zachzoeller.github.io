'use strict';

/**
 * @ngdoc overview
 * @name zachzoellergithubioApp
 * @description
 * # zachzoellergithubioApp
 *
 * Main module of the application.
 */
angular
  .module('zachzoellergithubioApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.bootstrap'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .when('/tables', {
        templateUrl: 'views/tables.html',
        controller: 'TablesCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
