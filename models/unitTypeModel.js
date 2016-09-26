var mongoose = require('mongoose');

var unitTypeSchema = mongoose.Schema({
    "name":             {type:String, required:true, index: { unique: true }},   // S10x10
    "description":      {type:String, required:true},
    "size":             {type:String, required:true, default:'10x10'},
    "defaultDeposit":   {type:Number, required:true, default:25},
    "defaultRate":      {type:Number, required:true, default:85},
    "defaultPeriod":    {type:String, required:true, default:'month'},
    "defaultNumPeriods":{type:Number, required:true, default:'12'},
    "count":            {type:Number},
    //"statusCount": [String, Number]
});

// export the schema and name it 
module.exports = mongoose.model('UnitType', unitTypeSchema, 'UnitTypes');