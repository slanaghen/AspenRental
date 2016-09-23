// load the node modules that we will use in this application
var express = require('express'),
    bodyParser = require('body-parser'),
    // logger = require('morgan'), // logging only for debugging.
    mongoose = require('mongoose'),
    routes = require('./controllers/routes');

// set port to 8080 by default, unless overridden by environment
var PORT = process.env.PORT || 8080;
var DBName = process.env.DBName || "aspenRental";

// create the app
var app = express();    

// make our database connection to the aspentRental database
mongoose.connect('mongodb://localhost/'+DBName, (error) => {
    if(error){
        console.error("Mongoose could not connect to",DBName, "\nConnection error: ", error);
        process.exit(1);
    } else {
        console.log("Mongoose connected to", DBName);
    }
});

// body parse all post requests to make them easier to use
// we will use parsed req.body to determine parameterized angular routes 
app.post('*', bodyParser.json(), bodyParser.urlencoded({extended:true}));

// set the server-side routes from the exported Routes
routes(app);

// include static routes for serving up static html files.
app.use(express.static('public'));

// start express listening for requests
app.listen(PORT, (err) => {
    if(err) {
        console.log("Server can't open port",  PORT, "\nError: ",err);
        process.exit(1);
    } else {
        console.log("Server listening to port", PORT);
    };
});