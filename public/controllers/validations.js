// validate unitType properties
var validateUnitType = function (unitType) {
    var patt = "";

    patt = /^\d+x\d+$/;
    if (patt.test(unitType.size) === false) {
        console.debug("Invalid size " + unitType.size);
        return false;
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
        return false;
    };

    patt = /^\d+x\d+$/;
    if (patt.test(unit.unitType.size) === false) {
        console.debug("Invalid size " + unit.unitType.size);
        return false;
    };
    return true;
};

// validate tenant properties
var validateTenant = function (tenant) {
    var patt = "";

    tenant.state = tenant.state.toUpperCase();
    patt = /^[A-Z][A-Z]$/;
    if (patt.test(tenant.state) === false) {
        console.debug("Invalid tenant state " + tenant.state);
        return false;
    };

    patt = /^\d\d\d\d\d$|^\d\d\d\d\d-\d\d\d\d$/;
    if (patt.test(tenant.zip) === false) {
        console.debug("Invalid tenant zip " + tenant.zip);
        return false;
    };

    patt = /^\d\d\d-\d\d\d-\d\d\d\d$|^\(\d\d\d\)\s*\d\d\d-\d\d\d\d$/;
    if (patt.test(tenant.cellPhone) === false) {
        console.debug("Invalid tenant cell phone " + tenant.cellPhone);
        return false;
    };

    patt = /^.*\@.*\..*$/;
    if (patt.test(tenant.email) === false) {
        console.debug("Invalid tenant eail " + tenant.email);
        return false;
    };
    return true;
};

// validate lease properties
var validateLease = function (lease) {
    return true;
};

// validate invoice properties
// TODO

// validate payment properties
// TODO

// UTILITIES
String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

String.prototype.formatPhone = function () {
    var re = /\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})/g;
    var subst = '$1-$2-$3';
    return this.replace(re, subst);
};

// TODO:
// Paralax
// var jumboHeight = $('.jumbotron').outerHeight();
// function parallax() {
//     var scrolled = $(window).scrollTop();
//     $('.bg').css('height', (jumboHeight - scrolled) + 'px');
// }

// $(window).scroll(function (e) {
//     parallax();
// });

