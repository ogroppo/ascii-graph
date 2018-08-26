var jsonGraph = require('./fixtures/nested2');
var asciiTree = require('./');

let tree = asciiTree(jsonGraph, {title: 'dio'});

console.log(tree)
