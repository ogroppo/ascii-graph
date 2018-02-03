module.exports = function addToMap(map, connector, levelIndex, connectorIndex){
		let mappedConnector = {
			node: connector.node
		}
		if(connector.rel)
			mappedConnector.rel = connector.rel

		map[levelIndex] = map[levelIndex] || {}
		map[levelIndex][connectorIndex] = mappedConnector;

		return mappedConnector;
}
