// TENANT CONTROLLER
angular.module('AspenRental')
    .controller('ARTenantController', arTenantController);

arTenantController.$inject = ['$http'];

// validate tenant properties
var validateTenant = function (tenant) {
    var patt = "";

    tenant.state = tenant.state.toUpperCase();
    // patt = /^[A-Z][A-Z]$/;
    // if (patt.test(tenant.state) === false) {
    //     console.debug("Invalid tenant state " + tenant.state);
    //     return false;
    // };

    // patt = /^\d\d\d\d\d$|^\d\d\d\d\d-\d\d\d\d$/;
    // if (patt.test(tenant.zip) === false) {
    //     console.debug("Invalid tenant zip " + tenant.zip);
    //     return false;
    // };

    // patt = /^\d\d\d-\d\d\d-\d\d\d\d$|^\(\d\d\d\)\s*\d\d\d-\d\d\d\d$/;
    // if (patt.test(tenant.cellPhone) === false) {
    //     console.debug("Invalid tenant cell phone " + tenant.cellPhone);
    //     return false;
    // };

    // patt = /^.*\@.*\..*$/;
    // if (patt.test(tenant.email) === false) {
    //     console.debug("Invalid tenant eail " + tenant.email);
    //     return false;
    // };
    return true;
};

function arTenantController($http) {
    console.debug('ARTenantController loaded');
    var arTenantCtl = this;

    arTenantCtl.tenants = [];
    arTenantCtl.newTenant = {};

    var presaveTenant = function (tenant,fname, lname, addr, city = "Salida", state = "CO", zip = 81201, phone, email) {
        tenant.firstName = fname.toLowerCase().capitalize();  // first name of tenant
        tenant.lastName = lname.toLowerCase().capitalize();   // last name of tenant
        tenant.address = addr;                                // street addresss
        tenant.city = city.toLowerCase().capitalize();        // city
        tenant.state = state.toUpperCase();                   // state
        tenant.zip = zip;                                     // zip code
        tenant.cellPhone = phone.formatPhone();               // cell phone number
        tenant.email = email;                                 // email address
        // this.driversLicense = driversLicense;               // drivers license
        // this.employer = employer;                           // employer
        tenant.comments = "";                                 // comments   
    };

    var getName = function(tenant) {
        return tenant.firstName + " " + tenant.lastName;
    };

    arTenantCtl.getTenants = function () {
        console.debug('getting tenants', arTenantCtl.tenants);
        // TODO: add key for api
        $http.get('/api/tenant')
            .then(function (res) {
                console.log("Received: Get /api/tenant", res.data);
                arTenantCtl.tenants = res.data;
            },function (error, status) {
                err = { message: error, status: status };
                console.log("ERROR /api/tenant: ",err.status);
            });
        console.debug('got tenants', arTenantCtl.tenants);
        return arTenantCtl.tenants;
    }

    // add a new customer
    arTenantCtl.addTenant = function () {
        if (validateTenant(arTenantCtl.newTenant)) {
            arTenantCtl.tenants.push(arTenantCtl.newTenant);
            $http.post('/api/tenant', arTenantCtl.newTenant)
                .then(function (res) {
                    console.log("Received: Post /api/tenant", res.data);
                    arTenantCtl.tenants.push(res.data);
                },function (error, status) {
                    err = { message: error, status: status };
                    console.log("ERROR /api/tenant: ",err.status);
                });
            arTenantCtl.newTenant = {};
            console.debug("Valid tenant added");
            arTenantCtl.badTenant = false;
        } else {
            console.debug("Invalid tenant NOT added");
            arTenantCtl.badTenant = true;
        };
    };

    // update customer info
    // TODO: add validation
    arTenantCtl.editTenant = function (tenant) {
        arTenantCtl.editTenant = {};
        // TODO:
        $http.put('/api/tenant', arTenantCtl.editTenant)
                .then(function (res) {
                    console.log("ERROR: Put /api/tenant", res.data);
                    arTenantCtl.tenants.push(res.data);
                },function (error, status) {
                    err = { message: error, status: status };
                    console.log(err.status);
                });
    };

    arTenantCtl.getTenants();
};
