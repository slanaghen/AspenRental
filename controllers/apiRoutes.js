// Aspen controller
// require all of the mongoose schema models to be used
var unitType = require("../models/unitTypeModel"),
    unit = require("../models/unitModel"),
    tenant = require("../models/tenantModel"),
    lease = require("../models/leaseModel"),
    invoice = require("../models/invoiceModel"),
    payment = require("../models/paymentModel");

// a simple responder to send json response to request
var respond = function (err, item) {
    console.log("Responding");
    if (err) {
        console.log("ERROR:",err);
        return res.json(err);
    } else {
        console.log(item);
        res.json(item);
    };
};

module.exports = {

    // GET::/api/:item?id=xxx
    get: (req, res) => {
        console.log("GET::", req.params);
        if (req.params.item) {
            var item = req.params.item; // item is unitType, unit, tenant, lease, invoice or payment
            var id = req.query.id; // id is optionally specified in request

            // if an id is specified, return the specified item
            if (id) {
                console.log("GET::", item, id);
                if (item === "unitType") {
                    UnitType.find({ name: id }, respond);
                } else if (item === "unit") {
                    Unit.find({ name: id }, respond);
                } else if (item === "tenant") {
                    Tenant.find({ name: id }, respond);
                } else if (item === "lease") {
                    Lease.find({ name: id }, respond);
                } else if (item === "invoice") {
                    Invoice.find({ name: id }, respond);
                } else if (item === "payment") {
                    Payment.find({ name: id }, respond);
                }

                // if no id is specifed, return all of the specified items
            } else {
                console.log("GET::", item , "list");
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
                console.log("GET::(unknown item) - redirect");
            res.redirect('/');
        }
    },

    // POST::/api/:item
    upsert: (req, res) => {
        if (req.params.item) {
            var itemName = req.params.item; // item is unitType, unit, tenant, invoice or payment (or array of one type)
            var item = req.body;  // this contains the object (or array of objects) defining the item

            console.log("POST::",itemName, item);

            if (item) {  
                console.log("Inserting");
                var newItem;
                if (itemName === "unitType") {
                    UnitType.insertMany(item, respond);
                } else if (itemName === "unit") {
                    Unit.insertMany(item, respond);
                } else if (itemName === "tenant") {
                    Tenant.insertMany(item, respond);
                } else if (itemName === "lease") {
                    Lease.insertMany(item, respond);
                } else if (itemName === "invoice") {
                    Invoice.insertMany(item, respond);
                } else if (itemName === "payment") {
                    Payment.insertMany(item, respond);
                };
            };
        } else {
            console.log("POST::(unknown item) - redirect");
            // send the user back home to try again.
            res.redirect('/');
        };
    }  // no semicolon here, exports list
};
            
    // if this is an insert of a single item
    // } else {
    //     console.log("POST::",item);
    //     var newItem;
    //     if (itemName === "unitType") {
    //         newItem = new UnitType(item);
    //     } else if (itemName === "unit") {
    //         newItem = new Unit(item);
    //     } else if (itemName === "tenant") {
    //         newItem = new Tenant(item);
    //     } else if (itemName === "lease") {
    //         newItem = new Lease(item);
    //     } else if (itemName === "invoice") {
    //         newItem = new Invoice(req.body);
    //     } else if (itemName === "payment") {
    //         newItem = new Payment(item);
    //     }
    //     // save the new item to the database
    //     newItem.save(respond);
    // };
//             //POST:: /api/ - no item specified...    
//         } else {
//     console.log("POST::(unknown item) - redirect");
//             // send the user back home to try again.
//             res.redirect('/');
//         };
//     }  // no semicolon here, exports list
// };