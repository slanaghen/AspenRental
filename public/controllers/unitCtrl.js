// UNIT CONTROLLER
angular.module('AspenRental')
    .controller('ARUnitController', arUnitController);
    
function arUnitController() {
    console.debug('ARUnitController loaded');
    var arUnitCtl = this;

    // load units
    arUnitCtl.units = JSON.parse(localStorage.getItem('units')) || dummyUnits;
    arUnitCtl.unitTypes = JSON.parse(localStorage.getItem('unitTypes')) || dummyUnitTypes;

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
        if (validateUnit(arUnitCtl.newUnit)) {
            arUnitCtl.units.push(arUnitCtl.newUnit);
            arUnitCtl.newUnit.status = "Available";
            arUnitCtl.newUnit = {};
            console.debug("Valid unit added");
            arUnitCtl.badUnit = false;
            // localStorage.setItem('units', JSON.stringify(arCtrlr.units));
        } else {
            console.debug("Invalid unit added");
            arUnitCtl.badUnit = true;
        };
    };
    // add a new unitType
    // TODO: add validation
    arUnitCtl.addUnitType = function () {
        if (validateUnitType(arUnitCtl.newUnitType)) {
            arUnitCtl.unitTypes.push(arUnitCtl.newUnitType);
            arUnitCtl.newUnitType = {};
            console.debug("Valid unitType added");
            arUnitCtl.badUnit = false;
            // localStorage.setItem('units', JSON.stringify(arCtrlr.units));
        } else {
            console.debug("Invalid unitType added");
            arUnitCtl.badUnit = true;
        };
    };
};

