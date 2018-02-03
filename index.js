var mapChildren = require('./lib/mapChildren');
var mapParents = require('./lib/mapParents');
var addToMap = require('./lib/addToMap');
var mapGraphToRowGraph = require('./lib/mapGraphToRowGraph');

function asciiGraph(levelGraph){
	var mapGraph = levelGraphToMapGraph(levelGraph);
	//console.log(mapGraph);
	var rowGraph = mapGraphToRowGraph(mapGraph)
	//console.log(rowGraph);
	drawRowGraph(rowGraph);
}

module.exports = asciiGraph;

function levelGraphToMapGraph(levelGraph){

	let root = levelGraph.root;
	root.display = root.node.name; // + labels....
	root.row = 0;
	root.left = 0;
	let map = {
		0: levelGraph.root
	}

	mapParents(map, levelGraph.parents);
	mapChildren(map, levelGraph.children);

	return map;
}

function drawRowGraph(rowGraph){
	var lines = [];
	for (var line of rowGraph) {
		lines.push(buildLine(line))
	}
	console.log();
	console.log(lines.join('\n'));
	console.log();
}

function buildLine(lineObject = []){
	let line = ''
	lineObject.forEach((connector)=>{
		if(line.length < connector.left)
			line += ' '.repeat(connector.left - line.length)

		line = line.slice(0, connector.left) + connector.display + line.slice(connector.left + connector.display.length)
	})
	return line
}

//																						 ┌-> ziooo
//				 						             ┌-> ssdfsc -┤
// 				 paren [p]-┐						 |					 └-> naltro
//  s	-┐						 |						 |           								 ┌-> ciic
//	c	-┼-> d [ladro]-┼-> the root -┼-> figlioccio ---> pastoo -┤
//	x	-┘             |						 |													 └-> ytf
//				 serpe [x]-┘						 └-> pane
