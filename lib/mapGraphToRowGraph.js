var getParent = require('./getParent');
var getChild = require('./getChild');

module.exports = function mapGraphToRowGraph(map){
	var rowGraph = [];
	var minRow = 0;
	var minLeft = 0;
	//get min
	for (var levelIndex in map) {
		if(levelIndex == 0) continue
		let level = map[levelIndex]
		for(var connectorIndex in level){

			let connector = level[connectorIndex]
			if(connector.row < minRow)
				minRow = connector.row;
			if(connector.left < minLeft)
				minLeft = connector.left;
		}
	}

	//normalize
	for (var levelIndex in map) {
		if(levelIndex == 0){
			let root = map[0]
			normalizeConnector(rowGraph, root, minLeft, minRow)
			continue
		}

		let level = map[levelIndex]
		for(var connectorIndex in level){
			let connector = level[connectorIndex]
			normalizeConnector(rowGraph, connector, minLeft, minRow)
		}
	}

	//add fills
	for (var levelIndex in map) {
		if(levelIndex == 0) continue
		levelIndex = parseInt(levelIndex)
		let level = map[levelIndex]
		for(var connectorIndex in level){
			connectorIndex = parseInt(connectorIndex)
			let connector = level[connectorIndex]
			let previous = level[connectorIndex-1]
			let next = level[connectorIndex+1]

			if(levelIndex > 0){
				let parent = getParent(map, connector, levelIndex)
				if(previous && previous.rel.start === connector.rel.start && (connector.row - previous.row) > 1){
					for (var gap = 1; gap < (connector.row - previous.row); gap++) {
						let fillRow = previous.row + gap
						let fill = {
							row: fillRow,
							display: "║",
							left: previous.left
						}
						if(fillRow === parent.row)
						fill.display = "╣"

						rowGraph[fillRow] = rowGraph[fillRow] || []
						rowGraph[fillRow].push(fill);
					}
				}

				if(!previous || (previous && previous.rel.start !== connector.rel.start)){
					connector.display = '╔' + connector.display.substring(1)
				}

				if(previous && next){
					connector.display = '╠' + connector.display.substring(1)
				}

				if(connector.row === parent.row){
					connector.display = '╬' + connector.display.substring(1)
				}

				if(!next || (next && next.rel.start !== connector.rel.start)){
					connector.display = '╚' + connector.display.substring(1)
				}

				if(parent.children === 1){
					connector.display = '═' + connector.display.substring(1)
				}

			}
			if(levelIndex < 0){
				let child = getChild(map, connector, levelIndex)
				if(previous && previous.rel.end === connector.rel.end && (connector.row - previous.row) > 1){
					for (var gap = 1; gap < (connector.row - previous.row); gap++) {
						let fillRow = previous.row + gap
						let fill = {
							row: fillRow,
							display: "║",
							left: previous.left + previous.display.length -1
						}
						let child = getChild(map, connector, levelIndex)
						if(fillRow === child.row)
						fill.display = "╠"

						rowGraph[fillRow] = rowGraph[fillRow] || []
						rowGraph[fillRow].push(fill);
					}
				}

				if(!previous || (previous && previous.rel.end !== connector.rel.end)){
					connector.display = connector.display.slice(0, -1) + '╗'
				}

				if(previous && next){
					connector.display = connector.display.slice(0, -1) + '╣'
				}

				if(connector.row === child.row){
					connector.display = connector.display.slice(0, -1) + '╬'
				}

				if(!next || (next && next.rel.end !== connector.rel.end)){
					connector.display = connector.display.slice(0, -1) + '╝'
				}

				if(child.parents === 1){
					connector.display = connector.display.slice(0, -1) + '═'
				}
			}
		}
	}

	return rowGraph;
}

function normalizeConnector(rowGraph, connector, minLeft, minRow){
	connector.left -= minLeft;
	connector.row -= minRow;

	let row = connector.row;
	rowGraph[row] = rowGraph[row] || []
	rowGraph[row].push(connector);
}
