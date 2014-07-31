(function () {
    'use strict';

	/**
	 * @ngdoc function
	 * @name zachzoellergithubioApp.controller:AboutCtrl
	 * @description
	 * # TablesCtrl
	 * Controller of the zachzoellergithubioApp
	 */
	angular
		.module('zachzoellergithubioApp')
	  	.controller('TablesCtrl', ['$scope', '$q', TablesCtrl]);

	  	function TablesCtrl ($scope, $q) {
		    $scope.title = "this is the tables title";


		    $scope.FilterAll = '';
		    $scope.searchCriteria = {
		        Page: 1,
		        NumberPerPage: 5,
		        Sort: "+name",
		        FilterAll: $scope.FilterAll,
		        Keyword: $scope.FilterAll
		    };

		    $scope.list = [];
		    $scope.tableModel = {
		        list: $scope.list,
		        searchCriteria: $scope.searchCriteria,
		        customGet: getData,
		        pageSizes: [5, 10, 15]
		    };

		    function getData() {
		    	var deferred = $q.defer();

		    	var data = [
		    		{
		    			name: 'Jim',
		    			age: 20
		    		},
		    		{
		    			name: 'John',
		    			age: 25
		    		},
					{
		    			name: 'Joe',
		    			age: 30
		    		},
		    		{
		    			name: 'zJim1',
		    			age: 20
		    		},
		    		{
		    			name: 'zJim',
		    			age: 20
		    		},
		    		{
		    			name: 'zJohn',
		    			age: 25
		    		},
					{
		    			name: 'zJoe',
		    			age: 30
		    		},
		    		{
		    			name: 'zzJim1',
		    			age: 20
		    		}    	
		    	];

		    	deferred.resolve(data);

		    	return deferred.promise;
		    }
		}
})();	
