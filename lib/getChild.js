module.exports = function getChild(map, connector, levelIndex){
	let nextLevelIndex = levelIndex + 1
	if(nextLevelIndex === 0)
		return map[0];

	let nextLevel = map[nextLevelIndex];
	for(let childIndex in nextLevel){
		//TODO parents with same children
		if(nextLevel[childIndex].node.id === connector.rel.end)
			return nextLevel[childIndex];
	}
}
