(function () {
    'use strict';
    angular.module('app').directive('zzTableServer', [
        '$timeout', function ($timeout) {
            function link(scope, element, attrs) {
                //console.log(JSON.stringify(scope));
            }

            return {
                restrict: 'A',                                
                scope: {                    
                    tableModel: '=tableModel'
                },
                link: link,
                controller: ['$scope', function ($scope) {

                    $scope.totalItems = 0;

                    $scope.refresh = refresh;
                    $scope.tableModel.refresh = refresh;
                    $scope.tableModel.changeSort = changeSort;
                    $scope.tableModel.changePage = changePage;
                    $scope.tableModel.totalItems = $scope.totalItems;

                    $scope.changeSort = changeSort;
                    $scope.changePage = changePage;

                    
                    function changePage(page) {
                        $scope.tableModel.searchCriteria.Page = page;
                        refresh();
                    }

                    function refresh() {                                                                          
                        $scope.tableModel.customGet().then(function (data) {
                            $scope.tableModel.list = data.Data;
                            $scope.totalItems = data.Total;
                            $scope.tableModel.totalItems = data.Total;                                                            
                        });                        
                    }
                    
                    function changeSort(sort) {                        
                        $scope.tableModel.searchCriteria.Sort = sort;
                        refresh();
                    }
                    
                    refresh();
                }]
            };
        }
    ]);
})();