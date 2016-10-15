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

    var presaveLease = function(lease, unit, tenant, date = Date(),
        deposit = unit.unitType.defaultDeposit,
        rate = unit.unitType.defaultRate,
        period = unit.unitType.defaultPeriod,
        numPeriods = unit.unitType.defaultNumPeriods) {
        lease.unit = unit;               // unit being leased
        lease.unit.changeStatus("Occupied");// set the unit's status to occupied with the new lease
        // TODO find a way to make this private/hidden
        // this.unit.status = "Occupied";  // set the unit's status to occupied with the new lease
        lease.tenant = tenant;           // tenant's full name
        lease.originalDate = date;       // date lease is signed
        lease.deposit = deposit;
        lease.rate = rate;               // periodic (month/quarter/year) rent
        lease.period = period;           // month, quarter or year
        lease.numPeriods = numPeriods;   // ie. 12 period for a month period year long lease
        lease.status = "Pending";        // Pending, Active or Retired
        lease.invoices = [new Invoice(lease, date, lease.rate + deposit)];  // list of invoices applied to this lease
        lease.ref = date.getFullYear().toString().slice(-2)
            + ('0' + date.getMonth()).slice(-2)
            + ('0' + date.getDate()).slice(-2)
            + '-' + lease.unit.unitId;
    };
        
    // calculate the end date of the lease
    var endDate = function (lease) {
        var startDate = lease.originalDate;
        var endDate = null;
        if (lease.period === 'month') {
            return new Date(startDate.getFullYear(),
                startDate.getMonth() + lease.numPeriods,
                startDate.getDate() - 1);
        } else if (lease.period === 'quarter') {
            return new Date(startDate.getFullYear(),
                startDate.getMonth() + (lease.numPeriods * 3),
                startDate.getDate() - 1);
        } else if (lease.period === 'year') {
            return new Date(startDate.getFullYear() + lease.numPeriods,
                startDate.getMonth(),
                startDate.getDate() - 1);
        }
        console.error("Bad period " + lease.period + " for lease on " +
            lease.unit.unitId + " detected in endDate().");
        return null;
    }

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

    // enter a payment for the given lease
    var makePayment = function(lease, amount, date) {
        lease.status = "Active";
        console.debug("Making payment of $" + amount + " for unit " +
            lease.unit.unitId + " on " + date.toDateString());
        // apply payment to earliest invoice with an unpaid balance
        for (var i = 0; i < lease.invoices.length; i++) {
            if (lease.invoices[i].balance() > 0) {
                console.debug("Applying payment of $" + amount + " for unit " +
                    lease.unit.unitId + " to invoice #" + i + " on " +
                    date.toDateString());
                amount = lease.invoices[i].applyPayment(amount, date);
                if (amount === 0) {
                    return;
                };
            };
        };
        // if all invoices are paid and there is an overpayment, 
        // create a future invoice and pay it.
        lease.makeInvoice();
        lease.makePayment(amount, date);
        return;
    };

    // create an invoice for the this lease
    var addInvoice = function(lease) {
        // TODO:
        if (lease.invoices.length >= lease.numPeriods) {
            lease.status === "Retired";
            thileases.unit.changeStatus("Available");
            console.debug("Lease retired/Unit available");
            return;
        }
        var dueDate = lease.nextDueDate();
        console.debug("Making invoice #" + (lease.invoices.length + 1) + " for unit " + lease.unit.unitId + " on " + dueDate.toDateString());
        var invoice = new Invoice(lease, dueDate);
        this.invoices.push(invoice);
    };

    var presaveInvoice = function(invoice, lease, date, amount = lease.rate) {
        invoice.lease = lease;             // lease to which this invoice applies
        invoice.amountDue = amount;        // payment amount due
        invoice.dueDate = date;            // date payment is due
        invoice.payments = [];             // list of payments applied to this invoice
        invoice.ref = date.getFullYear().toString().slice(-2)
            + ('0' + date.getMonth()).slice(-2)
            + ('0' + date.getDate()).slice(-2)
            + '-' + lease.unit.unitId;
    };
    // returns the balance due on this invoice
    var balance = function(invoice) {
        var balance = invoice.amountDue;
        for (var i = 0; i < invoice.payments.length; i++) {
            balance -= invoice.payments[i].amount;
        };
        return balance;
    };
    // applies a payment to this invoice and returns the amount of overpayment
    var applyPayment = function(invoice, amount, date) {
        console.debug("Applying payment of $" + amount + " on " + date.toDateString());
        var balance = invoice.balance();
        // apply the full amount of the payment to this invoice
        if (amount <= balance) {
            invoice.payments.push(new Payment(invoice, amount, date));
            // console.debug("Invoice for " + this.lease.unit.unitId + " has a balance of $" + this.balance() + ".");
            return 0;
            // if there is an overpayment...
        } else {
            this.payments.push(new Payment(invoice, balance, date));
            console.debug("Invoice for " + invoice.lease.unit.unitId + " paid.");
            return amount - balance;
        };
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
            arLeaseCtl.newLease.name = "L" + String("0000" + arLeaseCtl.leases.length).slice(-4); // pad number with zeroes
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
    arLeaseCtl.getLeases();
};

