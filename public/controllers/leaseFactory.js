angular.module('AspenRental')
    .factory('arLeaseFactory', arLeaseFactory);

arLeaseFactory.$inject = ['$http'];

function arLeaseFactory($http) {
    console.debug('arLeaseFactory loaded');

    var LeaseFactory =  {
        leases: []
    };


     var getLeases = function () {
        // load leases
        // TODO: Filter for only active leases
        // arLeaseCtl.leases = JSON.parse(localStorage.getItem('leases')) || dummyLeases;
        console.debug('getting leases', LeaseFactory.leases);
        // TODO: add key for api
        $http.get('/api/lease')
                .then(function (res) {
                    console.log("Leases received:", res.data);
                    LeaseFactory.leases = res.data;
                },function (error, status) {
                    var err = { message: "Leases error:"+error, status: status };
                    console.log(err.status);
                });
        console.debug('got leases', LeaseFactory.leases);
        return LeaseFactory.leases;
    }

    getLeases();

    return LeaseFactory;
}