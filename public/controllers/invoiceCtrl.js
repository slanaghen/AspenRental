// INVOICE CONTROLLER
angular.module('AspenRental')
    .controller('ARInvoiceController', arInvoiceController);

arInvoiceController.$inject = ['$http'];

function arInvoiceController($http) {
    console.debug('arInvoiceController loaded');
    var arInvoiceCtrl = this;

    // enter a payment for the given invoice
    var makePayment = function(invoice, amount, date) {
        invoice.status = "Active";
        console.debug("Making payment of $" + amount + " for unit " +
            invoice.unit.unitId + " on " + date.toDateString());
        // apply payment to earliest invoice with an unpaid balance
        for (var i = 0; i < invoice.invoices.length; i++) {
            if (invoice.invoices[i].balance() > 0) {
                console.debug("Applying payment of $" + amount + " for unit " +
                    invoice.unit.unitId + " to invoice #" + i + " on " +
                    date.toDateString());
                amount = invoice.invoices[i].applyPayment(amount, date);
                if (amount === 0) {
                    return;
                };
            };
        };
        // if all invoices are paid and there is an overpayment, 
        // create a future invoice and pay it.
        invoice.makeInvoice();
        invoice.makePayment(amount, date);
        return;
    };

    // create an invoice for the this invoice
    var makeInvoice = function(invoice) {
        // TODO:
        if (invoice.invoices.length >= invoice.numPeriods) {
            invoice.status === "Retired";
            invoice.unit.changeStatus("Available");
            console.debug("Invoice retired/Unit available");
            return;
        }
        var dueDate = invoice.nextDueDate();
        console.debug("Making invoice #" + (invoice.invoices.length + 1) + " for unit " + invoice.unit.unitId + " on " + dueDate.toDateString());
        var invoice = new Invoice(invoice, dueDate);
        this.invoices.push(invoice);
    };

    var presaveInvoice = function(invoice, date, amount = invoice.rate) {
        invoice.invoice = invoice;             // invoice to which this invoice applies
        invoice.amountDue = amount;        // payment amount due
        invoice.dueDate = date;            // date payment is due
        invoice.payments = [];             // list of payments applied to this invoice
        invoice.ref = date.getFullYear().toString().slice(-2)
            + ('0' + date.getMonth()).slice(-2)
            + ('0' + date.getDate()).slice(-2)
            + '-' + invoice.unit.unitId;
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
            // console.debug("Invoice for " + this.invoice.unit.unitId + " has a balance of $" + this.balance() + ".");
            return 0;
            // if there is an overpayment...
        } else {
            this.payments.push(new Payment(invoice, balance, date));
            console.debug("Invoice for " + invoice.invoice.unit.unitId + " paid.");
            return amount - balance;
        };
    };



    arInvoiceCtl.invoices = [];
    arInvoiceCtl.newInvoice = {};

    arInvoiceCtl.getInvoices = function () {
        // load invoices
        // TODO: Filter for only active invoices
        // arInvoiceCtl.invoices = JSON.parse(localStorage.getItem('invoices')) || dummyinvoices;
        console.debug('getting invoices', arInvoiceCtl.invoices);
        // TODO: add key for api
        $http.get('/api/invoice')
                .then(function (res) {
                    console.log("ERROR: Get /api/invoice", res.data);
                    arInvoiceCtl.invoices = res.data;
                },function (error, status) {
                    err = { message: error, status: status };
                    console.log(err.status);
                });
        console.debug('got invoices', arInvoiceCtl.invoices);
        return arInvoiceCtl.invoices;
    }

    // add a new invoice
    // TODO: add validation
    arInvoiceCtl.addInvoice = function () {
        if (validateinvoice(arInvoiceCtl.newInvoice)) {
            // TODO: add key for api
            $http.post('/api/invoice', arInvoiceCtl.newInvoice)
                .then(function (res) {
                    console.log("ERROR: Post /api/invoice", res.data);
                    arInvoiceCtl.invoices.push(res.data);
                },function (error, status) {
                    err = { message: error, status: status };
                    console.log(err.status);
                });
            arInvoiceCtl.invoices.push(arInvoiceCtl.newInvoice);
            arInvoiceCtl.newInvoice.unit.available = false;
            arInvoiceCtl.newInvoice = {};
            console.debug("Valid invoice added");
            arInvoiceCtl.badInvoice = true;
            // localStorage.setItem('invoices', JSON.stringify(arCtrlr.invoices));
        } else {
            console.debug("Invalid invoice NOT added");
            arInvoiceCtl.badInvoice = true;
        };
    };

    // identify all past due invoices
    arInvoiceCtl.pastDue = function () {
        console.debug("getting past due invoices"); 
        var pastDueInvoices = [];
        for (var i = 0; i < arInvoiceCtl.invoices.length; i++) {
            // if there is a balance on any past invoices, add to the list
            // Note that future invoices may exist and only be partially paid.
            if (balance(arInvoiceCtl.invoices[i]) > 0 && arInvoiceCtl.invoices[i].earliestUnpaidInvoiceDate() < Date.now()) {
                pastDueInvoices.push(arInvoiceCtl.invoices[i]);
            };
        };
        return pastDueInvoices;
    };

    // create invoices for all current invoices
    arInvoiceCtl.invoiceAll = function () {
        console.debug("Invoicing all invoices");
        for (var i = 0; i < arInvoiceCtl.invoices.length; i++) {
            // if nextDueDate is less than 15 days in the future, makeInvoice
            if (arInvoiceCtl.invoices[i].nextDueDate() < (Date.now() + (15 * 24 * 60 * 60 * 1000))) {
                arInvoiceCtl.invoices[i].makeInvoice(arInvoiceCtl.invoices[i]);
            };
        };
    };
};

