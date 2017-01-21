(function () {
    'use strict';
    var ejServices = angular.module('ej.ejServices', []);

    ejServices.constant('settings', {
        'ipAddress': '',
        'url': '/healthstore',
        'mobileRegExp': /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/,
        'loadquality': 5
    });

    ejServices.factory('cartService', ['$http', 'settings',
        function ($http, settings) {
            return {
                getCart: function (token, userid) {
                    return $http.get(settings.url + '/cart/' + userid + '?token1=' + token)
                },
                getbjCart: function (token, userid) {
                    return $http.get(settings.url + '/goods/cart/' + "?userid=" + userid + '&token=' + token)
                },
                addToCart: function (token, userid, goods, num) {
                    return $http({
                        url: settings.url + '/goods/addToCart',
                        method: "POST",
                        params: {
                            'token': token,
                            'userid': userid,
                            'goodsId': goods.id,
                            'num': num,
                            'name': name
                        }
                    });
                },
                //重新商品id的方法
                addToCart2: function (token, userid, goods, num) {
                    return $http({
                        url: settings.url + '/addToCart',
                        method: "GET",
                        params: {
                            'token': token,
                            'userid': userid,
                            'goodsId': goods,
                            'num': num,
                            'name': name
                        }
                    });
                },
            };
        }
    ]);
})();