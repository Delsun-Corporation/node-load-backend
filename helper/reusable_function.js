exports.objectSorterByStringValue = (sortBy) => (a, b) => a[sortBy].toLowerCase() > b[sortBy].toLowerCase() ? 1 : -1;

exports.createRandomStringName = () => {
    return require("crypto").randomBytes(64).toString('hex')
}

/// for sorting object using it's property
exports.dynamicSort = (property) => {
    var sortOrder = 1;

    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }

    return function (a,b) {
        /* next line works with strings and numbers, 
         * and you may want to customize it to your needs
         */

        // If property is string we will sort by alphabetically
        if(typeof a[property] == 'string') {
            console.log('aku suka kamu')
            return function (a, b) {
                // a[property].localeCompare(b[property])
                a.property.localeCompare(b.property, {sensitivity: 'base'})
            }
        }

        console.log('aku sangat suka kamu')
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}