// UNIT CONTROLLER
angular.module('AspenRental')
    .controller('ARUnitController', arUnitController);

arUnitController.$inject = ['$http'];

// validate unitType properties
var validateUnitType = function (unitType) {
    var patt = "";

    // patt = /^\d+x\d+$/;
    // if (patt.test(unitType.size) === false) {
    //     console.debug("Invalid size " + unitType.size);
    //     return false;
    // };
    return true;
};

// validate unit properties
var validateUnit = function (unit) {
    var patt = "";

    // unit.name = unit.name.toUpperCase();
    // patt = /^S\d\d$/;
    // if (patt.test(unit.name) === false) {
    //     console.debug("Invalid name " + unit.name);
    //     return false;
    // };

    // patt = /^\d+x\d+$/;
    // if (patt.test(unit.unitType.size) === false) {
    //     console.debug("Invalid size " + unit.unitType.size);
    //     return false;
    // };
    return true;
};

function arUnitController($http) {
    console.debug('ARUnitController loaded');
    var arUnitCtl = this;

    // load units
    arUnitCtl.units = [];
    arUnitCtl.unitTypes = [];

    arUnitCtl.newUnit = {};
    arUnitCtl.newUnitType = {};
    arUnitCtl.newUnit = {};
    arUnitCtl.newUnitType = {};

    arUnitCtl.getUnitTypes = function () {
        console.debug('getting unitTypes', arUnitCtl.unitTypes);
        // TODO: add key for api
        $http.get('/api/unitType')
            .then(function (res) {
                console.log("UnitTypes received:", res.data);
                arUnitCtl.unitTypes = res.data;
                console.debug('got unitTypes', arUnitCtl.unitTypes);
            });
    };

    arUnitCtl.getUnits = function () {
        console.debug('getting units', arUnitCtl.units);
        // TODO: add key for api
        $http.get('/api/unit')
            .then(function (res) {
                console.log("Units received:", res.data);
                arUnitCtl.units = res.data;
                console.debug('got units', arUnitCtl.units);
            });
    };

    // Not used
    // arUnitCtl.getNumOfSize = function (size) {
    //     var cnt = 0;
    //     for (var i = 0; i < arUnitCtl.units.length; i++) {
    //         if (arUnitCtl.units[i].size === size) {
    //             cnt++;
    //         }
    //     }
    //     return cnt;
    // };

    arUnitCtl.getAvailableUnitTypes = function () {
        var unitTypes = [];
        console.debug("get available unitTypes");
        for (var i = 0; i < arUnitCtl.units.length; i++) {
            if (arUnitCtl.units[i].status === 'Available') {
                if (unitTypes.indexof(arUnitCtl.units[i], unitType) === -1) {
                    unitTypes.push(arUnitCtl.units[i].unitType);
                }
            }
        }
        return unitTypes;
    };

    // add a new unit
    // TODO: add validation
    arUnitCtl.addUnit = function () {
        console.debug("AddUnit:", arUnitCtl.newUnit);
        if (validateUnit(arUnitCtl.newUnit)) {
            arUnitCtl.newUnit.status = "Available";
            $http.post('/api/unit', arUnitCtl.newUnit)
                .then(function (res) {
                    console.log("Posted /api/unit", res.data);
                    arUnitCtl.units.push(res.data);
                },function (error, status) {
                    err = { message: error, status: status };
                    console.log(err.status);
                });
            arUnitCtl.newUnit = {};
            console.debug("Valid unit added");
            arUnitCtl.badUnit = false;
        } else {
            console.debug("Invalid unit NOT added");
            arUnitCtl.badUnit = true;
        };
    };
    // add a new unitType
    // TODO: add validation
    arUnitCtl.addUnitType = function () {
        console.debug("Adding unitType");
        if (validateUnitType(arUnitCtl.newUnitType)) {
            $http.post('/api/unitType', arUnitCtl.newUnitType)
                // .success(function (res) {
                .then(function(res){
                    console.log("Posted /api/unitType", res.data);
                    arUnitCtl.unitTypes.push(res.data);
                },function (error, status) {
                    err = { message: error, status: status };
                    console.log(err.status);
                });
            arUnitCtl.newUnitType = {};
            console.debug("Valid unitType added");
            arUnitCtl.badUnit = false;
        } else {
            console.debug("Invalid unitType NOT added");
            arUnitCtl.badUnit = true;
        };
    };

    // initially populate unit lists
    arUnitCtl.getUnitTypes();
    arUnitCtl.getUnits();
};

