var mongoose = require('mongoose');

var invoiceSchema = mongoose.Schema({
    "name":             {type:String, required:true, index: { unique: true }},   // I160101-S99
    "leaseId":          {type : mongoose.Schema.ObjectId, ref : "Lease"},  
    "amountDue":        {type:Number, required:true},
    "dueDate":          {type:Date, required:true},
    //"payments":
});

// export the schema and name it
module.exports = mongoose.model('Invoice', invoiceSchema, 'Invoices');