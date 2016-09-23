// Aspen controller
// require all of the mongoose schema models to be used
var unitType = require("../models/unitTypeModel"),
    unit =     require("../models/unitModel"),
    tenant =   require("../models/tenantModel"),
    lease =    require("../models/leaseModel"), 
    invoice =  require("../models/invoiceModel"),
    payment =  require("../models/paymentModel");

module.exports = {

    // GET::/api/:item?id=xxx
    get: (req, res) => {
        if (req.params.item) {
            var item = req.params.item; // item is unitType, unit, tenant, lease, invoice or payment
            var id = req.query.id; // id is optionally specified in request

            // a simple responder to send json response to request
            var respond = function(err, item) {
                    if (err) {
                        return res.json(err);
                    } else {
                        res.json(item);
                    };
                };
            // if an id is specified, return the specified item
            if (id) {
                if (item === "unitType") {
                    UnitType.find({name:id}, respond);
                } else if (item === "unit") {
                    Unit.find({name:id}, respond);
                } else if (item === "tenant") {
                    Tenant.find({name:id}, respond);
                } else if (item === "lease") {
                    Lease.find({name:id}, respond);
                } else if (item === "invoice") {
                    Invoice.find({name:id}, respond);
                } else if (item === "payment") {
                    Payment.find({name:id}, respond);
                }

            // if no id is specifed, return all of the specified items
            } else {
                if (item === "unitType") {
                    UnitType.find({}, respond);
                } else if (item === "unit") {
                    Unit.find({}, respond);
                } else if (item === "tenant") {
                    Tenant.find({}, respond);
                } else if (item === "lease") {
                    Lease.find({}, respond);
                } else if (item === "invoice") {
                    Invoice.find({}, respond);
                } else if (item === "payment") {
                    Payment.find({}, respond);
                }

            }
        //GET:: /api/ - no item specified...    
        } else {
            // send the user back home to try again.
            res.redirect('/');
        }
    },

    // POST::/api/:item
    upsert: (req, res) => {
        if (req.params.item) {
            var item = req.body; // item is unit, tenant, invoice or payment (or array of one type)
            
            // a simple responder to send json response to request
            var respond = function(err, item) {
                    if (err) {
                        return res.json(err);
                    } else {
                        res.json(item);
                    };
                };

            // if this is a bulk insert...
            if (item.length >= 1) {
                var newItem;
                if (item === "unitType") {
                    UnitType.insertMany(item, respond);
                } else if (item === "unit") {
                    Unit.insertMany(item, respond);
                } else if (item === "tenant") {
                    Tenant.insertMany(item, respond);
                } else if (item === "lease") {
                    Lease.insertMany(item, respond);
                } else if (item === "invoice") {
                    Invoice.insertMany(item, respond);
                } else if (item === "payment") {
                    Payment.insertMany(item, respond);
                };

            // if this is an insert of a single item
            } else {
                var newItem;
                if (item === "unitType") {
                    newItem = new UnitType(req.body);
                } else if (item === "unit") {
                    newItem = new Unit(req.body);
                } else if (item === "tenant") {
                    newItem = new Tenant(req.body);
                } else if (item === "lease") {
                    newItem = new Lease(req.body);
                } else if (item === "invoice") {
                    newItem = new Invoice(req.body);
                } else if (item === "payment") {
                    newItem = new Payament(req.body);
                }
                // save the new item to the database
                newItem.save(respond);
            };
        //POST:: /api/ - no item specified...    
        } else {
            // send the user back home to try again.
            res.redirect('/');
        };
    }  // no semicolon here
};