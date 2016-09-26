// LEASE CONTROLLER
angular.module('AspenRental')
    .controller('ARLeaseController', arLeaseController);

arLeaseController.$inject = ['$http'];

// function homeController ($http) {
// 	var hCtrl = this;
// 	hCtrl.newBook = {};
// 	hCtrl.createBook = function() {
// 		$http.post('/library/createbook', hCtrl.newBook)
// 	};
// };

function arLeaseController($http) {
    console.debug('ARLeaseController loaded');
    var arLeaseCtl = this;

    // validate lease properties
    var validateLease = function (lease) {
        return true;
    };

    arLeaseCtl.leases = [];
    arLeaseCtl.newLease = {};

    arLeaseCtl.getLeases = function () {
        // load leases
        // TODO: Filter for only active leases
        // arLeaseCtl.leases = JSON.parse(localStorage.getItem('leases')) || dummyLeases;
        console.debug('getting leases', arLeaseCtl.leases);
        // TODO: add key for api
        arLeaseCtl.leases = $http.get('/api/lease');
        console.debug('got leases', arLeaseCtl.leases);
        return arLeaseCtl.leases;
    }

    // add a new lease
    // TODO: add validation
    arLeaseCtl.addLease = function () {
        if (validateLease(arLeaseCtl.newLease)) {
            // TODO: add key for api
            $http.post('/api/lease', arLeaseCtl.newLease);
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
        console.debug("getting past due leases"); 
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

