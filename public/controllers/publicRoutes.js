// ROUTER
// define the AspenRental ng module/ng-app 
angular.module('AspenRental', ['ngRoute'])
    .config(Router);

// inject routeFinder
// Router.$inject = ['$routeProvider'];
Router.$inject = ['$routeProvider'];

console.log('Loading publicRoutes');

// $routeProvider comes from the ngRoute module
function Router($routeProvider) {
    // This is where we define our routes
    $routeProvider
        .when('/invoice/', {
            templateUrl: '/templates/invoice.html'
        })
        .when('/tenant/', {
            templateUrl: '/templates/tenant.html',
            controller: 'ARTenantController as arTenantCtl'
        })
        .when('/lease/', {
            templateUrl: '/templates/lease.html',
            controller: 'ARLeaseController as arLeaseCtl'
        })        
        .when('/invoice/', {
            templateUrl: '/templates/invoice.html',
            controller: 'ARInvoiceController as arInvoiceCtl'
        })
        .when('/payments/', {
            templateUrl: '/templates/payments.html'
        })
        .when('/unit/', {
            templateUrl: '/templates/unit.html',
            controller: 'ARUnitController as arUnitCtl'
        })
        // If a user tries to go to a page that doesn't exist, take them back to the home page
            .otherwise({ redirectTo: '/index.html'
        });
};
// TODO: Custom directive template, to insert payment row element
// angular.module('AspenRental')
//     .directive('helloWorld', function() {
//   return {
//       restrict: 'E',
//       replace: 'true',
//       template: '<h3>Hello World!!</h3>'
//   };
// });
