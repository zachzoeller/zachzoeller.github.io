(function () {
    'use strict';
    angular.module('zachzoellergithubioApp').directive('zzTableClient', [
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
                controller: ['$scope', 'filterFilter', 'orderByFilter', function ($scope, filterFilter, orderByFilter) {
                    
                    $scope.tableModel.searchPage = 1;
                    $scope.tableModel.searchTotalItems = 0;
                    $scope.tableModel.searchList = [];

                    $scope.totalItems = 0;

                    $scope.refresh = refresh;
                    $scope.tableModel.refresh = refresh;
                    $scope.tableModel.search = search;
                    $scope.tableModel.changeSort = changeSort;
                    $scope.tableModel.changePage = changePage;
                    $scope.tableModel.getPage = getPage;
                    $scope.tableModel.getTotalItems = getTotalItems;
                    $scope.tableModel.totalItems = $scope.totalItems;
                    $scope.tableModel.isUsingSearch = false;
                    $scope.tableModel.updateSlice = updateSlice;

                    $scope.changeSort = changeSort;
                    $scope.changePage = changePage;
                    
                    function search() {
                        if ($scope.tableModel.searchCriteria.SearchText && $scope.tableModel.searchCriteria.SearchText != '') {
                            $scope.tableModel.isUsingSearch = true;
                            
                            $scope.tableModel.searchList = filterFilter($scope.tableModel.list, $scope.tableModel.searchCriteria.SearchText);
                            $scope.tableModel.searchPage = 1;
                            $scope.tableModel.searchTotalItems = $scope.tableModel.searchList.length;
                        } else {
                           $scope.tableModel.isUsingSearch = false;
                           $scope.tableModel.searchList = [];
                           $scope.tableModel.searchTotalItems = 0;
                        }

                        updateSlice();
                    }

                    function getPage() {
                        if ($scope.tableModel.isUsingSearch)
                            return $scope.tableModel.searchPage;

                        return $scope.tableModel.searchCriteria.Page;
                    }

                    function getTotalItems() {
                        if ($scope.tableModel.isUsingSearch)
                            return $scope.tableModel.searchTotalItems;

                        return $scope.tableModel.totalItems;
                    }

                    function updateSlice() {                        
                        var begin = ((getPage() - 1) * $scope.tableModel.searchCriteria.NumberPerPage), end = Number(begin) + Number($scope.tableModel.searchCriteria.NumberPerPage);

                        var sortDesc = false;
                        var sortField = $scope.tableModel.searchCriteria.Sort;
                        
                        if ($scope.tableModel.searchCriteria.Sort.indexOf('-') > -1) {
                            sortDesc = true;
                            sortField = sortField.replace('-', '');
                        } else {
                            sortField = sortField.replace('+', '');
                        }

                        var tempList = [];
                        if ($scope.tableModel.isUsingSearch) {
                            tempList = orderByFilter($scope.tableModel.searchList, sortField, sortDesc);
                        } else {
                            tempList = orderByFilter($scope.tableModel.list, sortField, sortDesc);
                        }
                        
                        $scope.tableModel.filteredList = tempList.slice(begin, end);                                                
                    }

                    function changePage() {                    
                        if ($scope.tableModel.isUsingSearch) {
                            $scope.tableModel.searchPage = $scope.tableModel.searchCriteria.Page;
                        } else {
                            $scope.tableModel.searchCriteria.Page = $scope.tableModel.searchCriteria.Page;
                        }

                        updateSlice();                        
                    }

                    function refresh() {
                        $scope.tableModel.customGet().then(function (data) {
                            $scope.tableModel.list = data;
                            $scope.totalItems = data.length;
                            $scope.tableModel.totalItems = data.length;

                            updateSlice();
                        });
                    }
                    
                    function changeSort(sort) {
                        $scope.tableModel.searchCriteria.Sort = sort;
                        updateSlice();                        
                    }

                    refresh();
                }]
            };
        }
    ]);
})();