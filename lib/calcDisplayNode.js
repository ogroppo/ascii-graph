const {isNotEmptyArray} = require('isnot')

module.exports = (node) => {
	let display = ''
	if(node.name)
		display += node.name

	if(isNotEmptyArray(node.labels))
		display += `[${node.labels.join('][')}]`

	return display
}
