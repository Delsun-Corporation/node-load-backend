const { dynamicSort } = require("../helper/reusable_function");

var People = [
    {Name: "10", Surname: "AAA"},
    {Name: "42", Surname: "Surname"},
    {Name:"5", Surname:"ZZZ"}
];

People.sort(dynamicSort("Name"));

console.log(People);