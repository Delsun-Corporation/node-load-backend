exports.objectSorterByStringValue = (sortBy) => (a, b) => a[sortBy].toLowerCase() > b[sortBy].toLowerCase() ? 1 : -1;

exports.createRandomStringName = () => {
    return require("crypto").randomBytes(64).toString('hex')
}