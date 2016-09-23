// TENANT CONTROLLER
angular.module('AspenRental')
    .controller('ARTenantController', arTenantController);

function arTenantController() {
    console.debug('ARTenantController loaded');
    var arTenantCtl = this;

    // load customers
    arTenantCtl.tenants = JSON.parse(localStorage.getItem('tenants')) || dummyTenants;

    // add a new customer
    arTenantCtl.addTenant = function () {
        if (validateTenant(arTenantCtl.newTenant)) {
            arTenantCtl.tenants.push(arTenantCtl.newTenant);
            arTenantCtl.newTenant = {};
            console.debug("Valid tenant added");
            arTenantCtl.badTenant = false;
            // localStorage.setItem('tenants', JSON.stringify(arCtrlr.tenants));
        } else {
            console.debug("Invalid tenant added");
            arTenantCtl.badTenant = true;
        };
    };
    
    // update customer info
    // TODO: add validation
    arTenantCtl.editTenant = function (tenant) {
        arTenantCtl.editTenant = {};
        // localStorage.setItem('tenants', JSON.stringify(arCtrlr.tenants));
    };
};
