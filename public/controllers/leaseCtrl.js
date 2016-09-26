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

    // calculate the balance due on this lease
    var balance = function (lease) {
        var total = 0;
        for (var i = 0; i < lease.invoices.length; i++) {
            // do not count future invoices in balance due.
            if (lease.invoices[i].dueDate.getTime() > Date.now()) { break; }
            var balance = lease.invoices[i].balance();
            console.debug(lease.unit.unitId + " invoice #" + i + " Balance $" +
                balance + " on " + lease.invoices[i].dueDate.toDateString());
            total += balance;
        };
        console.debug("Lease Balance : " + lease.unit.unitId + " $" + total);
        return total;
    };
    var balanceAsOf = function(lease, asOfDate) {
        var total = 0;
        // tally payment amounts made as of given date
        for (var i = 0; i < lease.invoices.length; i++) {
            for (var j = 0; j < lease.invoices[i].payments.length; j++) {
                if (leasethis.invoices[i].payments[j].date <= asOfDate) {
                    var pmt = lease.invoices[i].payments[j];
                    total += pmt.amount;
                };
            };
            // tally invoice amounts due as of given date
            if (lease.invoices[i].dueDate.getTime() > asOfDate) { break; }
            total -= lease.invoices[i].amountDue;
        };
        console.debug("Lease Balance as of " + asOfDate + ": " + lease.unit.unitId +
            " $" + total);
        return total;
    };
    // calculate the days past due from earliest unpaid invoice
    var earliestUnpaidInvoice = function(lease) {
        for (var i = 0; i < lease.invoices.length; i++) {
            if (lease.invoices[i].balance() > 0) {
                return lease.invoices[i];
            };
        };
        // all paid up!
        return null;
    };
    // calculate the days past due from earliest unpaid invoice
    var earliestUnpaidInvoiceDate = function(lease) {
        var inv = earliestUnpaidInvoice(lease);
        if (inv !== null) {
            return inv.dueDate;
        };
        // all paid up!
        return nextDueDate(lease);
    };
    var paidThru = function(lease) {
        var d = earliestUnpaidInvoiceDate(lease);
        return new Date(d.getFullYear(), d.getMonth(), d.getDate() - 1);
    };
    // calculate the days past due from earliest unpaid invoice
    var daysPastDue = function(lease) {
        // take difference of due date and today and convert from 
        // milliseconds to days
        return Math.ceil((Date.now() - earliestUnpaidInvoiceDate(lease).getTime()) / 86400000);
    };
    // calculate the due date for the next invoice
    var nextDueDate = function(lease) {
        // note the due date of the most recent outstanding invoice
        var due = thleaseis.invoices[tleasehis.invoices.length - 1].dueDate
        // and increment the due date by the specified period
        if (lease.period === "month") {
            return new Date(due.getFullYear(), due.getMonth() + 1, due.getDate());
        } else if (lease.period === "quarter") {
            return new Date(due.getFullYear(), due.getMonth() + 3, due.getDate());
        } else if (lease.period === "year") {
            return new Date(due.getFullYear() + 1, due.getMonth(), due.getDate());
        };
        console.error("Bad period " + lease.period + " for lease on " +
            lease.unit.unitId + " detected in NextDueDate.");
        return null;
    };

    arLeaseCtl.leases = [];
    arLeaseCtl.newLease = {};

    arLeaseCtl.getLeases = function () {
        // load leases
        // TODO: Filter for only active leases
        // arLeaseCtl.leases = JSON.parse(localStorage.getItem('leases')) || dummyLeases;
        console.debug('getting leases', arLeaseCtl.leases);
        // TODO: add key for api
        $http.get('/api/lease')
                .then(function (res) {
                    console.log("ERROR: Get /api/lease", res.data);
                    arLeaseCtl.leases = res.data;
                },function (error, status) {
                    err = { message: error, status: status };
                    console.log(err.status);
                });
        console.debug('got leases', arLeaseCtl.leases);
        return arLeaseCtl.leases;
    }

    // add a new lease
    // TODO: add validation
    arLeaseCtl.addLease = function () {
        if (validateLease(arLeaseCtl.newLease)) {
            // TODO: add key for api
            $http.post('/api/lease', arLeaseCtl.newLease)
                .then(function (res) {
                    console.log("ERROR: Post /api/lease", res.data);
                    arLeaseCtl.leases.push(res.data);
                },function (error, status) {
                    err = { message: error, status: status };
                    console.log(err.status);
                });
            arLeaseCtl.leases.push(arLeaseCtl.newLease);
            arLeaseCtl.newLease.unit.available = false;
            arLeaseCtl.newLease = {};
            console.debug("Valid lease added");
            arLeaseCtl.badLease = true;
            // localStorage.setItem('leases', JSON.stringify(arCtrlr.leases));
        } else {
            console.debug("Invalid lease NOT added");
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
            if (balance(arLeaseCtl.leases[i]) > 0 && arLeaseCtl.leases[i].earliestUnpaidInvoiceDate() < Date.now()) {
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

