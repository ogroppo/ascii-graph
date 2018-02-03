module.exports = function queryGraphToLevelGraph(queryGraph){
	var levelGraph = {};
	levelGraph.root = queryGraph.root;
	levelGraph.children = {};
	queryGraph.children.forEach((child)=>{
		if(!levelGraph.children[child.level])
			levelGraph.children[child.level] = [];

		levelGraph.children[child.level].push(child)
	})

	levelGraph.parents = {};
	queryGraph.parents.forEach((parent)=>{
		if(!levelGraph.parents[parent.level])
			levelGraph.parents[parent.level] = [];

		levelGraph.parents[parent.level].push(parent)
	})

	return levelGraph
}
