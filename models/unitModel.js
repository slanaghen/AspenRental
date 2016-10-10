var mongoose = require('mongoose');

var unitSchema = mongoose.Schema({
    "name":     {type:String, required:true, index: { unique: true }},           // S99
    "unitType": {type : mongoose.Schema.ObjectId, ref : "unitType"},
    "status":   {type:String, required:true, default:'Available'},
});

// export the schema and name it 
module.exports = mongoose.model('Unit', unitSchema, 'Units');