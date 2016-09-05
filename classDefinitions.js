class UnitType {
    constructor(description, size = "10x10", rate = 85, period = 'monthly', numPeriods = 12) {
        this.description = description;             // description of this type of unit
        this.size = size;                           // size of this type of unit
        this.defaultRate = rate;                    // default rental rate for this type of unit
        this.defaultPeriod = period.toLowerCase();  // default period for this type of unit (ie. monthly/quarterly/annual)
        this.defaultNumPeriods = numPeriods;        // default number of periods for this type of unit (ie. 12 for monthly year long lease)
    };
};

class Unit {
    constructor(unit, type, status = 'available') {
        this.unitId = unit.toUpperCase();               // unit identifier
        this.unitType = type;                           // type of unit (10x10 storage, 1BR residence, etc)
        this.status = status.toLowerCase().capitalize();// status of this unit available/occupied/unrentable
    };
};

class Payment {
    constructor(invoice, amt, date) {
        this.invoice = invoice;                         // invoice this payment was applied to   
        this.amount = amt;                              // amount of payment
        this.date = date;                               // date of payment
    };
};

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
    };
    get name() {
        return this.firstName + " " + this.lastName;
    };
};

// TODO: handle retired leases...
class Lease {
    constructor(unit, tenant, date = Date(), rate = unit.unitType.defaultRate,
        period = unit.unitType.defaultPeriod, numPeriods = unit.unitType.defaltNumPeriods) {
        this.unit = unit;               // unit being leased
        this.unit.status = "Occupied";  // set the unit's status to occupied with the new lease
        this.tenant = tenant;           // tenant's full name
        this.originalDate = date;       // date lease is signed
        this.rate = rate;               // periodic (monthly/quarterly/annual) rent
        this.period = period;           // monthly, quarterly or annual
        this.numPeriods = numPeriods;   // ie. 12 period for a monthly year long lease
        this.status = "Pending";        // Pending, Active or Retired
        this.invoices = [new Invoice(this, date)];  // list of invoices applied to this lease
    };
    // calculate the balance due on this lease
    balance() {
        var total = 0;
        for (var i = 0; i < this.invoices.length; i++) {
            // do not count future invoices in balance due.
            if (this.invoices[i].dueDate.getTime() > Date.now()) { break; }
            var balance = this.invoices[i].balance();
            console.debug(this.unit.unitId + " invoice #" + i + " Balance $" + balance + " on " + this.invoices[i].dueDate.toDateString());
            total += balance;
        };
        console.debug("Lease Balance : " + this.unit.unitId + " $" + total);
        return total;
    };
    // calculate the days past due from earliest unpaid invoice
    earliestUnpaidInvoiceDate() {
        for (var i = 0; i < this.invoices.length; i++) {
            if (this.invoices[i].balance() > 0) {
                return this.invoices[i].dueDate;
            };
        };
        // all paid up!
        return this.nextDueDate();
    };
    // calculate the days past due from earliest unpaid invoice
    daysPastDue() {
        // take difference of due date and today and convert from milliseconds to days
        return Math.ceil((Date.now() - this.earliestUnpaidInvoiceDate().getTime()) / 86400000);
    };
    // calculate the due date for the next invoice
    nextDueDate() {
        // note the due date of the most recent outstanding invoice
        var due = this.invoices[this.invoices.length - 1].dueDate
        // and increment the due date by the specified period
        if (this.period === "monthly") {
            return new Date(due.getFullYear(), due.getMonth() + 1, due.getDate());
        } else if (this.period === "quarterly") {
            return new Date(due.getFullYear(), due.getMonth() + 3, due.getDate());
        } else if (this.period === "annual") {
            return new Date(due.getFullYear() + 1, due.getMonth(), due.getDate());
        };
        console.error("Bad period " + this.period + " for lease on " + this.unit.unitId + " detected in NextDueDate.");
        return null;
    };
    // enter a payment for the given lease
    makePayment(amount, date) {
        this.status = "Active";
        console.debug("Making payment of $" + amount + " for unit " + this.unit.unitId + " on " + date.toDateString());
        // apply payment to earliest invoice with an unpaid balance
        for (var i = 0; i < this.invoices.length; i++) {
            if (this.invoices[i].balance() > 0) {
                console.debug("Applying payment of $" + amount + " for unit " + this.unit.unitId + " to invoice #" + i + " on " + date.toDateString());
                amount = this.invoices[i].applyPayment(amount, date);
                if (amount === 0) {
                    return;
                };
            };
        };
        // if all invoices are paid and there is an overpayment, create a future invoice and pay it.
        this.makeInvoice();
        this.makePayment(amount, date);
        return;
    };
    // create an invoice for the this lease
    makeInvoice() {
        // TODO:
        if (this.invoices.length >= this.numPeriods) {
            this.status === "Retired";
            this.invoices[i].status = "Available";
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
    constructor(lease, date) {
        this.lease = lease;             // lease to which this invoice applies
        this.amountDue = lease.rate;    // payment amount dueDate
        this.dueDate = date;            // date payment is due
        this.payments = [];             // list of payments applied to this invoice
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
