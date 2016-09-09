class UnitType {
    constructor(description, size = "10x10", deposit = 25, rate = 85,
        period = 'month', numPeriods = 12) {
        this.description = description;             // description of this type of unit
        this.size = size;                           // size of this type of unit
        this.defaultDeposit = deposit;              // default rental deposit for this type of unit
        this.defaultRate = rate;                    // default rental rate for this type of unit
        this.defaultPeriod = period.toLowerCase();  // default period for this type of unit (ie. month/quarter/year)
        this.defaultNumPeriods = numPeriods;        // default number of periods for this type of unit (ie. 12 for month period year long lease)
        this.count = 0;
        this.statusCount = { 'Available': 0, 'Occupied': 0, 'LockedOut': 0, 'Unrentable': 0 };
    };
};

class Unit {
    constructor(unit, type, status = 'Available') {
        this.unitId = unit.toUpperCase();               // unit identifier
        this.unitType = type;                           // type of unit (10x10 storage, 1BR residence, etc)
        this.status = status.toLowerCase().capitalize();// status of this unit available/occupied/unrentable
        this.unitType.count++;
        this.unitType.statusCount[this.status]++;
    };
    changeStatus(to) {
        this.unitType.statusCount[this.status]--;
        this.status = to.toLowerCase().capitalize();
        this.unitType.statusCount[this.status]++;
    }
};

class Payment {
    constructor(invoice, amt, date, method='check', ref='') {
        this.invoice = invoice;                         // invoice this payment was applied to   
        this.amount = amt;                              // amount of payment
        this.date = date;                               // date of payment
        this.method = method;                           // method of payment (cash, check, credit)
        this.ref = ref;                                 // payment reference (check #, transaction #, etc)
    };
};

// TODO: add driversLicense and employer to params and dummy info
class Tenant {
    constructor(fname, lname, addr, city = "Salida", state = "CO", zip = 81201, phone, email) {
        this.firstName = fname.toLowerCase().capitalize();  // first name of tenant
        this.lastName = lname.toLowerCase().capitalize();   // last name of tenant
        this.address = addr;                                // street addresss
        this.city = city.toLowerCase().capitalize();        // city
        this.state = state.toUpperCase();                   // state
        this.zip = zip;                                     // zip code
        this.cellPhone = phone.formatPhone();               // cell phone number
        this.email = email;                                 // email address
        // this.driversLicense = driversLicense;               // drivers license
        // this.employer = employer;                           // employer
        this.comments = "";                                 // comments   
    };
    get name() {
        return this.firstName + " " + this.lastName;
    };
    // TODO: add/edit comments
    // TODO: map to tenant home address
};

// TODO: handle retired leases...
class Lease {
    constructor(unit, tenant, date = Date(),
        deposit = unit.unitType.defaultDeposit,
        rate = unit.unitType.defaultRate,
        period = unit.unitType.defaultPeriod,
        numPeriods = unit.unitType.defaultNumPeriods) {
        this.unit = unit;               // unit being leased
        this.unit.changeStatus("Occupied");// set the unit's status to occupied with the new lease
        // TODO find a way to make this private/hidden
        // this.unit.status = "Occupied";  // set the unit's status to occupied with the new lease
        this.tenant = tenant;           // tenant's full name
        this.originalDate = date;       // date lease is signed
        this.deposit = deposit;
        this.rate = rate;               // periodic (month/quarter/year) rent
        this.period = period;           // month, quarter or year
        this.numPeriods = numPeriods;   // ie. 12 period for a month period year long lease
        this.status = "Pending";        // Pending, Active or Retired
        this.invoices = [new Invoice(this, date, this.rate + deposit)];  // list of invoices applied to this lease
        this.ref = date.getFullYear().toString().slice(-2)
            +('0'+date.getMonth()).slice(-2)
            +('0'+date.getDate()).slice(-2)
            +'-'+this.unit.unitId;
    };
    // calculate the end date of the lease
    endDate() {
        var startDate = this.originalDate;
        var endDate = null;
        if (this.period === 'month') {
            return new Date(startDate.getFullYear(),
                startDate.getMonth() + this.numPeriods,
                startDate.getDate() - 1);
        } else if (this.period === 'quarter') {
            return new Date(startDate.getFullYear(),
                startDate.getMonth() + (this.numPeriods * 3),
                startDate.getDate() - 1);
        } else if (this.period === 'year') {
            return new Date(startDate.getFullYear() + this.numPeriods,
                startDate.getMonth(),
                startDate.getDate() - 1);
        }
        console.error("Bad period " + this.period + " for lease on " +
            this.unit.unitId + " detected in endDate().");
        return null;
    }
    // calculate the balance due on this lease
    balance() {
        var total = 0;
        for (var i = 0; i < this.invoices.length; i++) {
            // do not count future invoices in balance due.
            if (this.invoices[i].dueDate.getTime() > Date.now()) { break; }
            var balance = this.invoices[i].balance();
            console.debug(this.unit.unitId + " invoice #" + i + " Balance $" +
                balance + " on " + this.invoices[i].dueDate.toDateString());
            total += balance;
        };
        console.debug("Lease Balance : " + this.unit.unitId + " $" + total);
        return total;
    };
    balanceAsOf(asOfDate) {
        var total = 0;
        // tally payment amounts made as of given date
        for (var i = 0; i < this.invoices.length; i++) {
            for (var j = 0; j < this.invoices[i].payments.length; j++) {
                if (this.invoices[i].payments[j].date <= asOfDate) {
                    var pmt = this.invoices[i].payments[j];
                    total += pmt.amount;
                };
            };
            // tally invoice amounts due as of given date
            if (this.invoices[i].dueDate.getTime() > asOfDate) { break; }
            total -= this.invoices[i].amountDue;
        };
        console.debug("Lease Balance as of " + asOfDate + ": " + this.unit.unitId +
            " $" + total);
        return total;
    };
    // calculate the days past due from earliest unpaid invoice
    earliestUnpaidInvoice() {
        for (var i = 0; i < this.invoices.length; i++) {
            if (this.invoices[i].balance() > 0) {
                return this.invoices[i];
            };
        };
        // all paid up!
        return null;
    };
    // calculate the days past due from earliest unpaid invoice
    earliestUnpaidInvoiceDate() {
        var inv = this.earliestUnpaidInvoice();
        if (inv !== null) {
            return inv.dueDate;
        }
        // all paid up!
        return this.nextDueDate();
    };
    paidThru() {
        var d = this.earliestUnpaidInvoiceDate();
        return new Date(d.getFullYear(), d.getMonth(), d.getDate() - 1);
    }
    // calculate the days past due from earliest unpaid invoice
    daysPastDue() {
        // take difference of due date and today and convert from 
        // milliseconds to days
        return Math.ceil((Date.now() - this.earliestUnpaidInvoiceDate().getTime()) / 86400000);
    };
    // calculate the due date for the next invoice
    nextDueDate() {
        // note the due date of the most recent outstanding invoice
        var due = this.invoices[this.invoices.length - 1].dueDate
        // and increment the due date by the specified period
        if (this.period === "month") {
            return new Date(due.getFullYear(), due.getMonth() + 1, due.getDate());
        } else if (this.period === "quarter") {
            return new Date(due.getFullYear(), due.getMonth() + 3, due.getDate());
        } else if (this.period === "year") {
            return new Date(due.getFullYear() + 1, due.getMonth(), due.getDate());
        };
        console.error("Bad period " + this.period + " for lease on " +
            this.unit.unitId + " detected in NextDueDate.");
        return null;
    };
    // enter a payment for the given lease
    makePayment(amount, date) {
        this.status = "Active";
        console.debug("Making payment of $" + amount + " for unit " +
            this.unit.unitId + " on " + date.toDateString());
        // apply payment to earliest invoice with an unpaid balance
        for (var i = 0; i < this.invoices.length; i++) {
            if (this.invoices[i].balance() > 0) {
                console.debug("Applying payment of $" + amount + " for unit " +
                    this.unit.unitId + " to invoice #" + i + " on " +
                    date.toDateString());
                amount = this.invoices[i].applyPayment(amount, date);
                if (amount === 0) {
                    return;
                };
            };
        };
        // if all invoices are paid and there is an overpayment, 
        // create a future invoice and pay it.
        this.makeInvoice();
        this.makePayment(amount, date);
        return;
    };
    // create an invoice for the this lease
    makeInvoice() {
        // TODO:
        if (this.invoices.length >= this.numPeriods) {
            this.status === "Retired";
            this.unit.changeStatus("Available");
            console.debug("Lease retired/Unit available");
            return;
        }
        var dueDate = this.nextDueDate();
        console.debug("Making invoice #" + (this.invoices.length + 1) + " for unit " + this.unit.unitId + " on " + dueDate.toDateString());
        var invoice = new Invoice(this, dueDate);
        this.invoices.push(invoice);
    };
};

class Invoice {
    constructor(lease, date, amount = lease.rate) {
        this.lease = lease;             // lease to which this invoice applies
        this.amountDue = amount;        // payment amount due
        this.dueDate = date;            // date payment is due
        this.payments = [];             // list of payments applied to this invoice
        this.ref = date.getFullYear().toString().slice(-2)
        +('0'+date.getMonth()).slice(-2)
        +('0'+date.getDate()).slice(-2)
        +'-'+lease.unit.unitId;
    };
    // returns the balance due on this invoice
    balance() {
        var balance = this.amountDue;
        for (var i = 0; i < this.payments.length; i++) {
            balance -= this.payments[i].amount;
        };
        return balance;
    };
    // applies a payment to this invoice and returns the amount of overpayment
    applyPayment(amount, date) {
        console.debug("Applying payment of $" + amount + " on " + date.toDateString());
        var balance = this.balance();
        // apply the full amount of the payment to this invoice
        if (amount <= balance) {
            this.payments.push(new Payment(this, amount, date));
            // console.debug("Invoice for " + this.lease.unit.unitId + " has a balance of $" + this.balance() + ".");
            return 0;
            // if there is an overpayment...
        } else {
            this.payments.push(new Payment(this, balance, date));
            console.debug("Invoice for " + this.lease.unit.unitId + " paid.");
            return amount - balance;
        };
    };
};
