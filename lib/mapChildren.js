var addToMap = require('./addToMap');
var getParent = require('./getParent');

module.exports = function mapChildren(map, children){
	for (var levelIndex in children) {
		levelIndex = parseInt(levelIndex)
		children[levelIndex].forEach((connector, connectorIndex)=>{
			if(connector.skip) //skip connector utility
				return;
			//get connector added to map
			let mapped = addToMap(map, connector, levelIndex, connectorIndex)
			//find parent
			var parent = getParent(map, connector, levelIndex)

			parent.children = parent.children || 0;

			let relativeIndex = Math.ceil(parent.children/2);
			let parentRow = parent.row; //the original parent row

			if(!(parent.children % 2)){ //even, just move the ones below parent
				//move siblings below parent up one to fill gap
				for (var previousIndex = 1; previousIndex <= relativeIndex; previousIndex++) {
					let previousConnector = map[levelIndex][connectorIndex-previousIndex];
					previousConnector.row--;
				}
			}

			if(parent.children % 2){ //odd children, two new rows need to be created
				for (var _levelIndex in map) {
					_levelIndex = parseInt(_levelIndex)
					//get children
					if(_levelIndex <= 0)
						continue;

					let _level = map[_levelIndex]
					for(var _connectorIndex in _level){
						let connectorToMove = _level[_connectorIndex]
						if(parentRow === 0){
							//move stuff below parent down, but not siblings
							//on the same level stuff can only go up, we cannot have stuff coming
							if(connectorToMove.row > 0 && _levelIndex !== levelIndex){
								connectorToMove.row++; //make space for new line
							}
							//move stuff above parent up
							if(connectorToMove.row < 0){
								connectorToMove.row--; //make space for first sibling going up
							}
						}

						if(parentRow > 0){
							//move block down
							if(connectorToMove.row >= parentRow){
								connectorToMove.row++;
							}

							//space for new
							if(connectorToMove.row > parentRow + relativeIndex){
								connectorToMove.row++;
							}
						}

						if(parentRow < 0){
							//all above parent move up 2
							if(connectorToMove.row < parentRow){
								connectorToMove.row -= 2;
							}else if(connectorToMove.row < parentRow + relativeIndex){
								//move all below parent, the parent and the middle (but not rows > 0)
								connectorToMove.row--;
							}
						}
					}
				}

				//the centered sibling is the only not affected from the above
				let middleConnector = map[levelIndex][connectorIndex-relativeIndex];
				let middleRow = middleConnector.row
				middleConnector.row--;

			}

			//move!
			if(parent.children === 0){
				parent.display += ' ═';
			}

			mapped.display = mapped.node.name; // + labels....
			let relDisplay = mapped.rel.name?`{${mapped.rel.name}}`:''
			mapped.display = ` ${relDisplay}═► ` + mapped.display

			mapped.row = parent.row + relativeIndex;

			mapped.left = parent.left + parent.display.length;


			parent.children++;
		})
	}
}
