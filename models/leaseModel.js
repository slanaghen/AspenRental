var mongoose = require('mongoose');

var leaseSchema = mongoose.Schema({
    "name":             {type:String, required:true},       // L160101-S99
    "unit":             {type:String, required:true},       // S99
    "tenantId":         {type:String, required:true},       // LANA-01
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