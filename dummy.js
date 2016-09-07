var dummyUnitTypes = [
    new UnitType("A 10' x 10' storage unit", "10x10", 85),
    new UnitType("A 10' x 15' storage unit", "10x15", 100),
    new UnitType("A 10' x 20' storage unit", "10x20", 120),
];

var dummyUnits = [
    new Unit("S01", dummyUnitTypes[0]),
    new Unit("S02", dummyUnitTypes[0]),
    new Unit("S03", dummyUnitTypes[0]),
    new Unit("S04", dummyUnitTypes[0]),
    new Unit("S05", dummyUnitTypes[0]),
    new Unit("S06", dummyUnitTypes[0]),
    new Unit("S07", dummyUnitTypes[1]),
    new Unit("S08", dummyUnitTypes[2]),
];

var dummyTenants = [
    new Tenant("John", "Doe", "123 Main St", "Salida", "CO", "80121", "3035555555", "jdoe@gmail.com"),
    new Tenant("Jane", "Doe", "100 77th St", "Salida", "CO", "80121", "(303)555-4444", "jdoe@yahoo.com"),
    new Tenant("Jill", "Doe", "101 11th St", "Salida", "CO", "80121", "303-555-2222", "jjdoe@yahoo.com"),
    new Tenant("Joe", "Blow", "5th & Main St", "Salida", "CO", "80121", "303-555-3333", "jblow@gmail.com"),
];

var dummyLeases = [
    new Lease(dummyUnits[3], "John Doe", new Date(2016, 2, 1)),
    new Lease(dummyUnits[4], "Jane Doe", new Date(2016, 2, 1)),
    new Lease(dummyUnits[5], "Jill Doe", new Date(2016, 2, 1)),
    new Lease(dummyUnits[6], "Joe Blow", new Date(2016, 2, 1)),
];

for (var i = 0; i < 4; i++) {
    for (var j = 0; j <= 7; j++) {
        dummyLeases[i].makeInvoice();
    }
}

// John Doe is ahead on payments
dummyLeases[0].makePayment(85, new Date(2016, 2, 2));
dummyLeases[0].makePayment(85, new Date(2016, 3, 2));
dummyLeases[0].makePayment(85, new Date(2016, 4, 2));
dummyLeases[0].makePayment(85, new Date(2016, 5, 2));
dummyLeases[0].makePayment(85, new Date(2016, 6, 2));
dummyLeases[0].makePayment(85, new Date(2016, 7, 2));
dummyLeases[0].makePayment(85, new Date(2016, 8, 2));
dummyLeases[0].makePayment(85, new Date(2016, 9, 2));
dummyLeases[0].makePayment(85, new Date(2016, 10, 2));
dummyLeases[0].makePayment(85, new Date(2016, 11, 2));
dummyLeases[0].makePayment(85, new Date(2016, 12, 2));// 13th month!
dummyLeases[0].makePayment(85, new Date(2016, 13, 2));// 14th month!

// Jane Doe is right on payments
dummyLeases[1].makePayment(85, new Date(2016, 2, 2));
dummyLeases[1].makePayment(85, new Date(2016, 3, 2));
dummyLeases[1].makePayment(85, new Date(2016, 4, 2));
dummyLeases[1].makePayment(85, new Date(2016, 5, 2));
dummyLeases[1].makePayment(85, new Date(2016, 6, 2));
dummyLeases[1].makePayment(85, new Date(2016, 7, 2));
dummyLeases[1].makePayment(85, new Date(2016, 8, 2));

// Jill is behind on payments
dummyLeases[2].makePayment(85, new Date(2016, 2, 2));
dummyLeases[2].makePayment(85, new Date(2016, 3, 2));
dummyLeases[2].makePayment(85, new Date(2016, 4, 2));
dummyLeases[2].makePayment(85, new Date(2016, 5, 2));
dummyLeases[2].makePayment(85, new Date(2016, 6, 2));

// Joe is varied, but on schedule with payments
dummyLeases[3].makePayment(75, new Date(2016, 2, 2));
dummyLeases[3].makePayment(150, new Date(2016, 3, 2));
dummyLeases[3].makePayment(100, new Date(2016, 4, 2));
dummyLeases[3].makePayment(85, new Date(2016, 5, 2));
dummyLeases[3].makePayment(200, new Date(2016, 6, 2));
dummyLeases[3].makePayment(10, new Date(2016, 7, 2));
dummyLeases[3].makePayment(100, new Date(2016, 8, 2));

// TODO: test retired lease