(function () {
    "use strict";
    var ejDirectives = angular.module("ej.ejDirectives", []);

    ejDirectives.directive("cartQuality", ['$http', 'settings', 'sessionService', function ($http, settings, sessionService) {
        return {
            templateUrl: 'directives/cartquality.html',
            restrict: 'E',
            replace: true,
            scope: false,
            link: function (scope, element, attrs) {
                scope.quality = 1;
                scope.minus = function () {
                    if (Number(scope.quality) === 1) {
                        return;
                    } else {
                        scope.quality = (Number(scope.quality) - 1);
                    }
                    $parse(iAttrs['ngModel']).assign($scope, quality);
                    $scope.$apply();
                };
                scope.plus = function () {
                    scope.quality = Number(scope.quality) + 1;
                };
            }
        };
    }]);
})();