module.exports = function getParent(map, connector, levelIndex){
	let nextLevelIndex = levelIndex - 1
	if(nextLevelIndex === 0)
		return map[0];
		
	let prevLevel = map[levelIndex-1];
	for(let parentIndex in prevLevel){
		//TODO parents with same children
		if(prevLevel[parentIndex].node.id === connector.rel.start)
			return prevLevel[parentIndex];
	}
}
