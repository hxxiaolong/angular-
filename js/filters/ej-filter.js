(function() {
  'use strict';
  var ejFilter = angular.module('ej.ejFilter', []);


  ejFilter.filter('parsenum', function() {
     return function(input) {
      var outText = parseInt(input);
     return outText;
    };
  });

})();
