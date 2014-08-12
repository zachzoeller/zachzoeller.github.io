'use strict';

/**
 * @ngdoc function
 * @name zachzoellergithubioApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the zachzoellergithubioApp
 */
angular.module('zachzoellergithubioApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    $scope.dt = {};
  });
