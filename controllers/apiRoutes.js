// Aspen controller

console.log('Loading apiRoutes');

// require all of the mongoose schema models to be used
var UnitType = require("../models/unitTypeModel"),
    Unit = require("../models/unitModel"),
    Tenant = require("../models/tenantModel"),
    Lease = require("../models/leaseModel"),
    Invoice = require("../models/invoiceModel"),
    Payment = require("../models/paymentModel"),
    Bcrypt = require('bcryptjs'),
    User = require('../models/user');

// errors = {
//     general: {
//         status: 500,
//         message: 'Backend Error'
//     },
//     login: {
//         status: 403,
//         message: 'Invalid username or password.'
//     }
// };

module.exports = {

    // render: (req, res) => { // render the login page
    //     res.render('auth', req.session);
    // },
    // logout: (req, res) => {
    //     req.session.reset(); // clears the users cookie session
    //     res.redirect('/login');
    // },
    // login: (req, res) => { // form post submission
    //     User.findOne({
    //         email: req.body.email
    //     }, (err, user) => {
    //         if( err ) {
    //             console.error('MongoDB error:'.red, err);
    //             res.status(500).json(errors.general);
    //         }
    //         if( !user ) {
    //             // forbidden
    //             console.warn('No user found!'.yellow);
    //             res.status(403).json(errors.login);
    //         } else {
    //             console.info('auth.login.user', user);
    //             // at this point, user.password is hashed!
    //             Bcrypt.compare(req.body.password, user.password, (bcryptErr, matched) => {
    //                 // matched will be === true || false
    //                 if( bcryptErr ) {
    //                     console.error('MongoDB error:'.red, err);
    //                     res.status(500).json(errors.general);
    //                 } else if ( !matched ) {
    //                     // forbidden, bad password
    //                     console.warn('Password did not match!'.yellow);
    //                     res.status(403).json(errors.login);
    //                 } else {
    //                     req.session.uid = user._id; // this is what keeps our user session on the backend!
    //                     res.send({ message: 'Login success' }); // send a success message
    //                 }
    //             });
    //         }
    //     });
    // },
    // register: (req, res) => {
    //     console.info('Register payload:'.cyan, req.body);

    //     var newUser = new User(req.body);

    //     newUser.save((err, user) => {
    //         if( err ) {
    //             console.log('#ERROR#'.red, 'Could not save new user :(', err);
    //             res.status(500).send(errors.general);
    //         } else {
    //             console.log('New user created in MongoDB:', user);
    //             req.session.uid = user._id; // this is what keeps our user session on the backend!
    //             res.send({ message: 'Register success' }); // send a success message
    //         }
    //     });
    // },
    // // Auth middleware functions, grouped
    // middlewares: {
    //     session: (req, res, next) => {
    //         if( req.session.uid ) {
    //             console.info('User is logged in, proceeding to dashboard...'.green);
    //             next();
    //         } else {
    //             console.warn('User is not logged in!'.yellow)
    //             res.redirect('/login');
    //         }
    //     }
    // },

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
                    UnitType.find({ name: id }, (err, found) => {
                        console.log("Sending",found.length,"unitType");
                        res.json(found);
                    });
                } else if (item === "unit") {
                    Unit.find({ name: id }, (err, found) => {
                        console.log("Sending",found.length,"unit");
                        res.json(found);
                    });
                } else if (item === "tenant") {
                    Tenant.find({ name: id }, (err, found) => {
                        console.log("Sending",found.length,"tenant");
                        res.json(found);
                    });
                } else if (item === "lease") {
                    Lease.find({ name: id }, (err, found) => {
                        console.log("Sending",found.length,"lease");
                        res.json(found);
                    });
                } else if (item === "invoice") {
                    Invoice.find({ name: id }, (err, found) => {
                        console.log("Sending",found.length,"invoice");
                        res.json(found);
                    });
                } else if (item === "payment") {
                    Payment.find({ name: id }, (err, found) => {
                        console.log("Sending",found.length,"payment");
                        res.json(found);
                    });
                }

                // if no id is specifed, return all of the specified items
            } else {
                console.log("GET::", item , "list");
                if (item === "unitType") {
                    UnitType.find({}, (err, found) => {
                        console.log("Sending",found.length,"unitTypes");
                        res.json(found);
                    });
                } else if (item === "unit") {
                    Unit.find({}, (err, found) => {
                        console.log("Sending",found.length,"units");
                        res.json(found);
                    });
                } else if (item === "tenant") {
                    Tenant.find({}, (err, found) => {
                        console.log("Sending",found.length,"tenants");
                        res.json(found);
                    });
                } else if (item === "lease") {
                    Lease.find({}, (err, found) => {
                        console.log("Sending",found.length,"leases");
                        res.json(found);
                    });
                } else if (item === "invoice") {
                    Invoice.find({}, (err, found) => {
                        console.log("Sending",found.length,"invoices");
                        res.json(found);
                    });
                } else if (item === "payment") {
                    Payment.find({}, (err, found) => {
                        console.log("Sending",found.length,"payments");
                        res.json(found);
                    });
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

            if (typeof req.body === 'Array') {  
                console.log("POST::many",itemName, item);
                var newItem;
                if (itemName === "unitType") {
                    UnitType.insertMany(req.body, respond);
                } else if (itemName === "unit") {
                    Unit.insertMany(req.body, respond);
                } else if (itemName === "tenant") {
                    Tenant.insertMany(req.body, respond);
                } else if (itemName === "lease") {
                    Lease.insertMany(req.body, respond);
                } else if (itemName === "invoice") {
                    Invoice.insertMany(req.body, respond);
                } else if (itemName === "payment") {
                    Payment.insertMany(req.body, respond);
                };
            
            // if this is an insert of a single item
            } else {
                console.log("POST::single",itemName, req.body);
                var newItem;
                if (itemName === "unitType") {
                    newItem = new UnitType(req.body);
                } else if (itemName === "unit") {
                    newItem = new Unit(req.body);
                } else if (itemName === "tenant") {
                    item.name = req.body.lastName.substring(0,4).toUpperCase() + "-01";
                    newItem = new Tenant(req.body);
                } else if (itemName === "lease") {
                    newItem = new Lease(req.body);
                } else if (itemName === "invoice") {
                    newItem = new Invoice(req.body);
                } else if (itemName === "payment") {
                    newItem = new Payment(req.body);
                };
                // save the new item to the database
                console.log("Saving", newItem);
                newItem.save(function(err, data) {
                    if (err) {
                        console.log("Save Error:", err);
                        res.json(err);
                    } else {
                        console.log("Saved:", data);
                        res.json(data);
                    };
                });
            }
            //POST:: /api/ - no item specified...    
        } else {
            console.log("POST::(unknown item) - redirect");
            // send the user back home to try again.
            res.redirect('/');
        };
    }  // no semicolon here, exports list
};