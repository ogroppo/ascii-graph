module.exports = function getNodeDisplay(node){
  let display = ' ' //empty node would be this
  if(node.name)
    display += node.name + ' '

  if(node.labels && node.labels.length)
    display += `[${node.labels.join('][')}] `

  if(node.value !== undefined)
    display += `#${node.value} `

  if(node.date)
    display += `@${node.date} `

  if(node.text)
    display += `"${node.text}" `

  return display
}
