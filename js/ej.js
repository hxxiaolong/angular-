(function () {

    'use strict';

    var ejModel = angular.module('ejModel', [
        'ngRoute',
        "ej.ejControllers",
        'ej.ejFilter',
        'ej.ejDirectives',
        'ej.ejServices'
    ]);

    ejModel.config(['$routeProvider', '$locationProvider',
        function ($routeProvider, $locationProvider) {
            $routeProvider.
            when('/', {
                templateUrl: 'views/index.html',
                controller: 'indexController',
                title: 'e居首页'
            }).when('/index2', {
                    templateUrl: 'views/index2.html',
                    controller: 'index2Controller',
                    title: '评价页面'
                })
            .when('/assess/:orderid', {
                templateUrl: 'views/assess.html',
                controller: 'assessController',
                title: '评价页面'
            }).otherwise({
                redirectTo: '/'
            });
        }
    ]);

})();