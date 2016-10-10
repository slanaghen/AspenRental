var mongoose = require('mongoose');

var paymentSchema = mongoose.Schema({
    "name":             {type:String, required:true, index: { unique: true }},    // P160101-S99
    "invoiceId":        {type : mongoose.Schema.ObjectId, ref : "Invoice"},
    "amount":           {type:Number, required:true},
    "date":             {type:Date, required:true},
    "method":           {type:String, default:'check'},
    "reference":        {type:String, default:''}
});

// export the schema and name it
module.exports = mongoose.model('Payment', paymentSchema, 'Payments');