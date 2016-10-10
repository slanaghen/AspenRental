var mongoose = require('mongoose');

var leaseSchema = mongoose.Schema({
    "name":             {type:String, required:true, index: { unique: true }},       // L160101-S99
    "unit":             {type : mongoose.Schema.ObjectId, ref : "Unit"},   
    "tenantId":         {type : mongoose.Schema.ObjectId, ref : "Tenant"},    
    "originalDate":     {type:Date, required:true},
    "deposit":          {type:Number, required:true},
    "rate":             {type:Number, required:true},
    "period":           {type:String, required:true},
    "numPeriods":       {type:Number, required:true},
    "status":           {type:String, required:true}
    // invoices[]
});

// export the schema and name it
module.exports = mongoose.model('Lease', leaseSchema, 'Leases');