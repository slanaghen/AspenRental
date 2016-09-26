var apiRoutes = require('./apiRoutes');

module.exports = function(app) {

    // root route
    app.get('/', (req, res) => {
        res.sendFile('index.html', { root: './public' });
    });    

    // public root route
    app.get('/index-public.html', (req, res) => {
        res.sendFile('index-public.html', { root: './public' });
    });

    // middleware for api paths to verify a valid session key
    function checkKeyMiddleware( req, res, next ) {
        console.debug("Received:",req);
        // console.log("Checking for key: ", req.query.key);
        // if( req.query.key ) {
        //     next();
        // } else {
        //     console.log("You are blocked");
        //     // TODO: create session key for secure requests and block invalid requests here
        //     // res.send("You are blocked");
        //     next();
        // };
    };

    // api routes for aspen
    // GET::/api/:item         gets all items
    // GET::/api/:item?id=XXX  gets the item with the specified id
    // POST::/api/:item       creates one or more items
    // /api/unitType
    // /api/unit
    // /api/tenant
    // /api/lease
    // /api/invoice
    // /api/payment
    app.get('/api/*', checkKeyMiddleware, apiRoutes.get);
    app.post('/api/*', checkKeyMiddleware, apiRoutes.upsert);
};