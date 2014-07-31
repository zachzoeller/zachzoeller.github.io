(function () {
    'use strict';
    angular
        .module('zachzoellergithubioApp')
        .directive('sortColumnHeader', [sortColumnHeader]);

    function sortColumnHeader() {
        return {
            link: function (scope, element, attrs, ctrl) {

                scope.sortDirection = '';

                scope.sort = function () {
                    if (scope.columnName === attrs.currentSort.substring(1, attrs.currentSort.length)) {
                        if (attrs.currentSort.indexOf('-') > -1) {
                            scope.sortDirection = 'ASC';
                            scope.onSort({ sort: '+' + scope.columnName });
                        } else {
                            scope.sortDirection = 'DESC';
                            scope.onSort({ sort:  '-' + scope.columnName });
                        }
                    } else {
                        scope.sortDirection = 'ASC';
                        scope.onSort({ sort: '+' + scope.columnName });
                    }
                };

                attrs.$observe('currentSort', function (newValue, oldValue) {
                    if (scope.columnName !== newValue.replace('-', '') && scope.columnName !== newValue.replace('+', '')) {
                        scope.sortDirection = '';
                    }
                });
            },
            replace: true,
            restrict: 'E',
            scope: {
                columnDesc: '@',
                columnName: '@',
                onSort: '&'
            },
            template: '<div data-ng-click=\"sort()\">{{columnDesc}} <b class="glyphicon" data-ng-class="\{ \'glyphicon-chevron-up\': sortDirection == \'ASC\', \'glyphicon-chevron-down\': sortDirection == \'DESC\' }\"></b></div>'
        };
    }
})();