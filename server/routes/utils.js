exports.mapSchema = function (identifier) {
    let schemaName;
    switch (identifier.toLowerCase()) {
    case 'material':
        schemaName = 'Material';
        break;
    case 'variant':
        schemaName = 'Variant';
        break;
    case 'inventory':
        schemaName = 'Inventory';
        break;
    case 'order':
        schemaName = 'Order';
        break;
    }
    return schemaName;
}