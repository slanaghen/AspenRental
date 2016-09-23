var mongoose = require('mongoose');

var invoiceSchema = mongoose.Schema({
    "name":             {type:String, required:true},   // I160101-S99
    "leaseId":          {type:String, required:true},   // L160101-S99
    "amountDue":        {type:Number, required:true},
    "dueDate":          {type:Date, required:true},
    //"payments":
});

// export the schema and name it
module.exports = mongoose.model('Invoice', invoiceSchema, 'Invoices');