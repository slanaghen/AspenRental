angular.module('AspenRental')
    .factory('arUnitFactory', arUnitFactory);

arUnitFactory.$inject = ['$http'];

function arUnitFactory($http) {
    console.debug('arUnitFactory loaded');

    var UnitFactory = {
        units : [],
        unitTypes : [],
        availableUnitTypes : [],
        getUnits : getUnits,
        getUnitTypes : getUnitTypes,
        getAvailableUnitTypes : getAvailableUnitTypes
    };

    // get all unitTypes from database
    var getUnitTypes = function () {
        console.debug('getting unitTypes');
        // TODO: add key for api
        $http.get('/api/unitType')
            .then(function (res) {
                // console.log("UnitTypes received:", res.data);
                UnitFactory.unitTypes = res.data;
                console.debug('got unitTypes', UnitFactory.unitTypes);
                return UnitFactory.unitTypes;
            }, function (error, status) {
                var err = { message: "UnitTypes Error: " + error, status: status };
                console.log(err.status);
            });
    };    
    getUnitTypes();

    // get all units from database
    var getUnits = function () {
        console.debug('getting units');
        // TODO: add key for api
        $http.get('/api/unit')
            .then(function (res) {
                // console.log("Units received:", res.data);
                UnitFactory.units = res.data;
                console.debug('got units', UnitFactory.units);
                return UnitFactory.units;
            }, function (error, status) {
                var err = { message: "Units Error: " + error, status: status };
                console.log(err.status);
            });
    };
    getUnits();

    // get all unitTypes that have 1 or more that are available
    var getAvailableUnitTypes = function () {
        console.debug("getting available unitTypes");
        for (var i = 0; i < UnitFactory.units.length; i++) {
            if (UnitFactory.units[i].status === 'Available') {
                if (UnitFactory.availableUnitTypes.indexof(UnitFactory.units[i].unitType) === -1) {
                    UnitFactory.availableUnitTypes.push(UnitFactory.units[i].unitType);
                }
            }
        }
        return UnitFactory.availableUnitTypes;
    }
    getAvailableUnitTypes();

    return UnitFactory;
}