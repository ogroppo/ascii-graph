var addToMap = require('./addToMap');
var getChild = require('./getChild');

module.exports = function mapParents(map, parents){
	for (var levelIndex in parents) {
		levelIndex = parseInt(levelIndex)
		parents[levelIndex].forEach((connector, connectorIndex)=>{
			if(connector.skip) return;

			let mapped = addToMap(map, connector, -levelIndex, connectorIndex)

			var child = getChild(map, connector, -levelIndex)

			child.parents = child.parents || 0;

			let relativeIndex = Math.ceil(child.parents/2);
			let childRow = child.row; //the original child row

			if(!(child.parents % 2)){ //even, just move the ones below parent
				//move siblings below parent up one to fill gap
				for (var previousIndex = 1; previousIndex <= relativeIndex; previousIndex++) {
					let previousConnector = map[-levelIndex][connectorIndex-previousIndex];
					previousConnector.row--;
				}
			}

			if(child.parents % 2){ //odd children, two new rows need to be created
				for (var _levelIndex in map) {
					_levelIndex = parseInt(_levelIndex)
					//get children
					if(_levelIndex >= 0)
						continue;

					let _level = map[_levelIndex]
					for(var _connectorIndex in _level){
						let connectorToMove = _level[_connectorIndex]
						if(childRow === 0){
							//move stuff below parent down, but not siblings
							//on the same level stuff can only go up, we cannot have stuff coming
							if(connectorToMove.row > 0 && _levelIndex !== -levelIndex){
								connectorToMove.row++; //make space for new line
							}
							//move stuff above parent up
							if(connectorToMove.row < 0){
								connectorToMove.row--; //make space for first sibling going up
							}
						}

						if(childRow > 0){
							//move block down
							if(connectorToMove.row >= childRow){
								connectorToMove.row++;
							}

							//space for new
							if(connectorToMove.row > childRow + relativeIndex){
								connectorToMove.row++;
							}
						}

						if(childRow < 0){
							//all above parent move up 2
							if(connectorToMove.row < childRow){
								connectorToMove.row -= 2;
							}else if(connectorToMove.row < childRow + relativeIndex){
								//move all below parent, the parent and the middle (but not rows > 0)
								connectorToMove.row--;
							}
						}
					}
				}

				//the centered sibling is the only not affected from the above
				let middleConnector = map[-levelIndex][connectorIndex-relativeIndex];
				let middleRow = middleConnector.row
				middleConnector.row--;

			}

			if(child.parents === 0){
				child.display = '═► '+child.display;
				child.left = child.left - 3 //bacause of above
			}

			mapped.display = mapped.node.name; // + labels....
			let relDisplay = mapped.rel.name?`{${mapped.rel.name}}`:''
			mapped.display += ` ═${relDisplay} `

			mapped.left = child.left - mapped.display.length;

			mapped.row = child.row + relativeIndex;

			child.parents++;
		})
	}
}
