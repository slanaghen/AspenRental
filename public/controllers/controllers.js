// ROUTER
angular.module('AspenRental', ['ngRoute'])
    .config(Router);
Router.$inject = ['$routeProvider'];
// $routeProvider comes from the ngRoute module
function Router($routeProvider) {
    // If a user tries to go to a page that doesn't exist, take them back to the home page
    $routeProvider.otherwise({ redirectTo: '/' });
    // This is where we define our routes
    $routeProvider
        .when('/home/', {
            templateUrl: '/templates/home.html'
        })
        .when('/action/', {
            templateUrl: '/templates/action.html'
        })
        .when('/tenant/', {
            templateUrl: '/templates/tenant.html',
            controller: 'ARTenantController as arTenantCtl'
        })
        .when('/lease/', {
            templateUrl: '/templates/lease.html'
        })
        .when('/payments/', {
            templateUrl: '/templates/payments.html'
        })
        .when('/unit/', {
            templateUrl: '/templates/unit.html',
            controller: 'ARUnitController as arUnitCtl'
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


// UNIT CONTROLLER
angular.module('AspenRental')
    .controller('ARUnitController', arUnitController);
function arUnitController() {
    console.info('ARUnitController loaded');
    var arUnitCtl = this;

    // load units
    arUnitCtl.units = JSON.parse(localStorage.getItem('units')) || dummyUnits;
    arUnitCtl.unitTypes = JSON.parse(localStorage.getItem('unitTypes')) || dummyUnitTypes;

    arUnitCtl.getNumOfSize = function(size) {
        var cnt = 0;
        for(var i=0;i<arUnitCtl.units.length;i++) {
            if (arUnitCtl.units[i].size === size) {
                cnt++;
            }
        }
        return cnt;
    };
    // add a new unit
    // TODO: add validation
    arUnitCtl.addUnit = function () {
        if (validateUnit(arUnitCtl.newUnit)) {
            arUnitCtl.units.push(arUnitCtl.newUnit);
            arUnitCtl.newUnit.status = "Available";
            arUnitCtl.newUnit = {};
            console.debug("Valid unit added");
            arUnitCtl.badUnit = false;
            // localStorage.setItem('units', JSON.stringify(arCtrlr.units));
        } else {
            console.debug("Invalid unit added");
            arUnitCtl.badUnit = true;
        };
    };
    // add a new unitType
    // TODO: add validation
    arUnitCtl.addUnitType = function () {
        if (validateUnitType(arUnitCtl.newUnitType)) {
            arUnitCtl.unitTypes.push(arUnitCtl.newUnitType);
            arUnitCtl.newUnitType = {};
            console.debug("Valid unitType added");
            arUnitCtl.badUnit = false;
            // localStorage.setItem('units', JSON.stringify(arCtrlr.units));
        } else {
            console.debug("Invalid unitType added");
            arUnitCtl.badUnit = true;
        };
    };
};

// TENANT CONTROLLER
angular.module('AspenRental')
    .controller('ARTenantController', arTenantController);
function arTenantController() {
    console.info('ARTenantController loaded');
    var arTenantCtl = this;

    // load customers
    arTenantCtl.tenants = JSON.parse(localStorage.getItem('tenants')) || dummyTenants;
    // add a new customer
    arTenantCtl.addTenant = function () {
        if (validateTenant(arTenantCtl.newTenant)) {
            arTenantCtl.tenants.push(arTenantCtl.newTenant);
            arTenantCtl.newTenant = {};
            console.debug("Valid tenant added");
            arTenantCtl.badTenant = false;
            // localStorage.setItem('tenants', JSON.stringify(arCtrlr.tenants));
        } else {
            console.debug("Invalid tenant added");
            arTenantCtl.badTenant = true;
        };
    };
    // update customer info
    // TODO: add validation
    arTenantCtl.editTenant = function (tenant) {
        arTenantCtl.editTenant = {};
        // localStorage.setItem('tenants', JSON.stringify(arCtrlr.tenants));
    };
};

// LEASE CONTROLLER
angular.module('AspenRental')
    .controller('ARLeaseController', arLeaseController);
function arLeaseController() {
    console.info('ARLeaseController loaded');
    var arLeaseCtl = this;

    // load leases
    // TODO: Filter for only active leases
    arLeaseCtl.leases = JSON.parse(localStorage.getItem('leases')) || dummyLeases;
    // add a new lease
    // TODO: add validation
    arLeaseCtl.addLease = function () {
        if (validateLease(arLeaseCtl.newLease)) {
            arLeaseCtl.leases.push(arLeaseCtl.newLease);
            arLeaseCtl.newLease.unit.available = false;
            arLeaseCtl.newLease = {};
            console.debug("Valid lease added");
            arLeaseCtl.badLease = true;
            // localStorage.setItem('leases', JSON.stringify(arCtrlr.leases));
        } else {
            console.debug("Invalid lease added");
            arLeaseCtl.badLease = true;
        };
    };
    // identify all past due leases
    arLeaseCtl.pastDue = function () {
        var pastDueLeases = [];
        for (var i = 0; i < arLeaseCtl.leases.length; i++) {
            // if there is a balance on any past invoices, add to the list
            // Note that future invoices may exist and only be partially paid.
            if (arLeaseCtl.leases[i].balance() > 0 && arLeaseCtl.leases[i].earliestUnpaidInvoiceDate() < Date.now()) {
                pastDueLeases.push(arLeaseCtl.leases[i]);
            };
        };
        return pastDueLeases;
    };
    // create invoices for all current leases
    arLeaseCtl.invoiceAll = function () {
        console.debug("Invoicing all leases");
        for (var i = 0; i < arLeaseCtl.leases.length; i++) {
            // if nextDueDate is less than 15 days in the future, makeInvoice
            if (arLeaseCtl.leases[i].nextDueDate() < (Date.now() + (15 * 24 * 60 * 60 * 1000))) {
                arLeaseCtl.leases[i].makeInvoice(arLeaseCtl.leases[i]);
            };
        };
    };
};

