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

    var presaveUnit = function (unit, type, status = 'Available') {
        unit.unitId = unit.toUpperCase();               // unit identifier
        unit.unitType = type;                           // type of unit (10x10 storage, 1BR residence, etc)
        unit.status = status.toLowerCase().capitalize();// status of this unit available/occupied/unrentable
        unit.unitType.count++;
        unit.unitType.statusCount[unit.status]++;
    };

    var presaveUnitType = function (unitType, description, size = "10x10", deposit = 25, rate = 85,
        period = 'month', numPeriods = 12) {
        unitType.description = description;             // description of this type of unit
        unitType.size = size;                           // size of this type of unit
        unitType.defaultDeposit = deposit;              // default rental deposit for this type of unit
        unitType.defaultRate = rate;                    // default rental rate for this type of unit
        unitType.defaultPeriod = period.toLowerCase();  // default period for this type of unit (ie. month/quarter/year)
        unitType.defaultNumPeriods = numPeriods;        // default number of periods for this type of unit (ie. 12 for month period year long lease)
        unitType.count = 0;
        unitType.statusCount = { 'Available': 0, 'Occupied': 0, 'LockedOut': 0, 'Unrentable': 0 };
    };

    var changeStatus = function (unit, to) {
        unit.unitType.statusCount[unit.status]--;
        unit.status = to.toLowerCase().capitalize();
        unit.unitType.statusCount[unit.status]++;
    }

    // initialize ng models
    arUnitCtl.units = [];
    arUnitCtl.unitTypes = [];
    arUnitCtl.availableUnitTypes = [];

    arUnitCtl.newUnit = {};
    arUnitCtl.newUnitType = {};
    arUnitCtl.newUnit = {};
    arUnitCtl.newUnitType = {};

    // get all unitTypes from database
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

    // get all units from database
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

    // get all unitTypes that have 1 or more that are available
    arUnitCtl.getAvailableUnitTypes = function () {
        console.debug("get available unitTypes");
        for (var i = 0; i < arUnitCtl.units.length; i++) {
            if (arUnitCtl.units[i].status === 'Available') {
                if (arUnitCtl.availableUnitTypes.indexof(arUnitCtl.units[i], unitType) === -1) {
                    arUnitCtl.availableUnitTypes.push(arUnitCtl.units[i].unitType);
                }
            }
        }
        return arUnitCtl.availableUnitTypes;
    };


    // function searchUnitTypes(nameKey, myArray) {
    //     for (var i = 0; i < myArray.length; i++) {
    //         console.log("searching ", myArray[i]._id, nameKey)
    //         if (myArray[i]._id === nameKey) {
    //             return myArray[i];
    //         }
    //     }
    // }

    // add a new unit
    // TODO: add validation
    arUnitCtl.addUnit = function () {
        if (validateUnit(arUnitCtl.newUnit)) {
            arUnitCtl.newUnit.status = "Available";
            arUnitCtl.newUnit.size = arUnitCtl.newUnit.unitType.size;
            arUnitCtl.newUnit.name = "S" + String("00" + arUnitCtl.units.length).slice(-2); // pad number with zeroes
            // arUnitCtl.newUnit.name="S"+searchUnitTypes(arUnitCtl.newUnit.unitType, arUnitCtl.unitTypes);
            $http.post('/api/unit', arUnitCtl.newUnit)
                .then(function (res) {
                    console.log("Posted /api/unit", res.data);
                    arUnitCtl.units.push(res.data);
                }, function (error, status) {
                    err = { message: error, status: status };
                    console.log(err.status);
                });
            arUnitCtl.newUnit = {};
            console.debug("Valid unit added");
            arUnitCtl.badUnit = false;
            // re-fetch units to populate unitType information
            arUnitCtl.getUnits();
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
                .then(function (res) {
                    console.log("Posted /api/unitType", res.data);
                    arUnitCtl.unitTypes.push(res.data);
                }, function (error, status) {
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

    // initially populate unit and unitTypelists
    arUnitCtl.getUnitTypes();
    arUnitCtl.getUnits();
    arUnitCtl.getAvailableUnitTypes();
};

