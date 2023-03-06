const { dynamicSort } = require("../helper/reusable_function");

var People = [
    {Name: "10 KM", Surname: "AAA"},
    {Name: "42 KM", Surname: "Surname"},
    {Name:"5 KM", Surname:"ZZZ"}
];

People.sort(dynamicSort("Name"));

console.log(People);