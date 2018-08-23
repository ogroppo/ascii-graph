var jsonGraph = require('./fixtures/nested');
var asciiTree = require('./');

let tree = asciiTree(jsonGraph);

console.log(tree)
