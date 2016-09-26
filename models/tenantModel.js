var mongoose = require('mongoose');

var tenantSchema = mongoose.Schema({
    "name":             {type:String, required:true, index: { unique: true }},       // LANA-01
    "firstName":        {type:String, required:true},
    "lastName":         {type:String, required:true},
    "address":          {type:String, required:true},
    "city":             {type:String, required:true, default:'Salida'},
    "state":            {type:String, required:true, default:'CO'},
    "zip":              {type:String, required:true, default:81201},
    "cellPhone":        {type:String, required:true},
    "email":            {type:String, required:true},
    "comments":         {type:String}
});

// export the schema and name it
module.exports = mongoose.model('Tenant', tenantSchema, 'Tenants');