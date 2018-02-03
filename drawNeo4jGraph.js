const asciiGraph = require('./index')
const queryGraphToLevelGraph = require('./lib/queryGraphToLevelGraph');

var jsonGraph = require('./fixtures/neo4jQueryGraph');
var levelGraph = queryGraphToLevelGraph(jsonGraph);
//console.log(levelGraph);
asciiGraph(levelGraph);
