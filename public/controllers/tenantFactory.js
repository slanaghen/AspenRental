angular.module('AspenRental')
    .factory('arTenantFactory', arTenantFactory);

arTenantFactory.$inject = ['$http'];

function arTenantFactory($http) {
    console.debug('arTenantFactory loaded');

    var TenantFactory =  {
        tenants: [],
        getName: getName,
        getTenants: getTenants
    };

    var getName = function (tenant) {
        return tenant.firstName + " " + tenant.lastName;
    };

    var getTenants = function () {
        console.debug('getting tenants');
        // TODO: add key for api
        $http.get('/api/tenant')
            .then(function (res) {
                console.log("Tenants received", res.data);
                TenantFactory.tenants = res.data;
                console.debug('got tenants', TenantFactory.tenants);
                return TenantFactory.tenants;
            }, function (error, status) {
                var err = { message: "Tenants error:" + error, status: status };
                console.log("ERROR /api/tenant: ", err.status);
            });
    };
    getTenants();

    return TenantFactory;
}