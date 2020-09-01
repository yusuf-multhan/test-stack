require('./server/schemas/MaterialSchema.js');
require('./server/schemas/VariantSchema.js');
require('./server/schemas/InventorySchema.js');

const mongoose = require('mongoose');

const dbURI = 'mongodb://localhost:27017/';
mongoose.connect(dbURI, { dbName: 'gr-inventory', useNewUrlParser: true });

// CONNECTION EVENTS
mongoose.connection.on('connected', function () {
    console.log('Mongoose connected to ' + dbURI);
    doInsert();
});
mongoose.connection.on('error', function (err) {
    console.log('Mongoose connection error: ' + err);
});
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose disconnected');
});

function doInsert () {
    doMaterialInsert();
    doVariantInsert();
    // doInventoryInsert();
}


function doMaterialInsert () {
    const materials = [
        '7D',
        'Flip',
        'Plastic',
        'Rexis',
        'Primary',
        'Leather'
    ]
    const MatModel = mongoose.model('Material');
    MatModel.insertMany(
        materials.map(i => {return {name: i}}),
        (err, docs) => {
            console.log(err, docs);
        }
    );
}

function doVariantInsert () {
    const variants = [
        'Asus-Max',
        'Honour Pro',
        'Mi Note 8',
        'Asus-Min',
        'Honour Pro Max',
        'IPhone 7'
    ]
    const VariantModel = mongoose.model('Variant');
    VariantModel.insertMany(
        variants.map(i => {return {name: i}}),
        (err, docs) => {
            console.log(err, docs);
        }
    );
}