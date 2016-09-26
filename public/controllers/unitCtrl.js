// UNIT CONTROLLER
angular.module('AspenRental')
    .controller('ARUnitController', arUnitController);


arUnitController.$inject = ['$http'];

// validate unitType properties
var validateUnitType = function (unitType) {
    var patt = "";

    patt = /^\d+x\d+$/;
    if (patt.test(unitType.size) === false) {
        console.debug("Invalid size " + unitType.size);
        // return false;
    };
    return true;
};

// validate unit properties
var validateUnit = function (unit) {
    var patt = "";

    unit.name = unit.name.toUpperCase();
    patt = /^S\d\d$/;
    if (patt.test(unit.name) === false) {
        console.debug("Invalid name " + unit.name);
        // return false;
    };

    patt = /^\d+x\d+$/;
    if (patt.test(unit.unitType.size) === false) {
        console.debug("Invalid size " + unit.unitType.size);
        // return false;
    };
    return true;
};

function arUnitController($http) {
    console.debug('ARUnitController loaded');
    var arUnitCtl = this;

    // load units
    // arUnitCtl.units = JSON.parse(localStorage.getItem('units')) || dummyUnits;
    // arUnitCtl.unitTypes = JSON.parse(localStorage.getItem('unitTypes')) || dummyUnitTypes;
    arUnitCtl.units = [];
    arUnitCtl.unitTypes = [];

    arUnitCtl.newUnit = {};
    arUnitCtl.newUnitType = {};
    arUnitCtl.newUnit = {};
    arUnitCtl.newUnitType = {};

    arUnitCtl.getUnitTypes = function () {
        console.debug('getting unitTypes', arUnitCtl.unitTypes);
        // TODO: add key for api
        arUnitCtl.unitTypes = $http.get('/api/unitType');
        console.debug('got unitTypes', arUnitCtl.unitTypes);
        return arUnitCtl.unitTypes;
    };

    arUnitCtl.getUnits = function () {
        console.debug('getting units', arUnitCtl.units);
        // TODO: add key for api
        arUnitCtl.units = $http.get('/api/unit');
        console.debug('got units', arUnitCtl.units);
        return arUnitCtl.units;
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
        console.debug("DBG:", arUnitCtl.newUnit);
        if (validateUnit(arUnitCtl.newUnit)) {
            arUnitCtl.newUnit.status = "Available";
            // $http.post('/api/unit', {
            //     name:arUnitCtl.newUnit.name,
            //     unitType:arUnitCtl.newUnit.name,
            //     status:arUnitCtl.newUnit.name
            // })
            $http.post('/api/unit', arUnitCtl.newUnit)
            .then(function (res) {
                console.log(res.data);
                arUnitCtl.unitTypes.push(res.data);
            });
            arUnitCtl.newUnit = {};
            console.debug("Valid unit added");
            arUnitCtl.badUnit = false;
        } else {
            console.debug("Invalid unit added");
            arUnitCtl.badUnit = true;
        };
    };
    // add a new unitType
    // TODO: add validation
    arUnitCtl.addUnitType = function () {
        console.debug("Adding unitType");
        // var unitType = new UnitType(
        //     arUnitCtl.newUnitType.name,
        //     arUnitCtl.newUnitType.size,
        //     arUnitCtl.newUnitType.description,
        //     arUnitCtl.newUnitType.defaultRate,
        //     arUnitCtl.newUnitType.defaultDeposit,
        //     arUnitCtl.newUnitType.defaultPeriod,
        //     arUnitCtl.newUnitType.defaultNumPeriods
        // );
        if (validateUnitType(arUnitCtl.newUnitType)) {
            $http.post('/api/unitType', arUnitCtl.newUnitType)
            .then(function (res) {
                console.log(res.data);
                arUnitCtl.unitTypes.push(res.data);
            });
            arUnitCtl.newUnitType = {};
            console.debug("Valid unitType added");
            arUnitCtl.badUnit = false;
        } else {
            console.debug("Invalid unitType added");
            arUnitCtl.badUnit = true;
        };
    };
};

