const moment = require('moment')

module.exports = function getNodeDisplay(node){
  let display = ' ' //empty node would be this
  if(node.name)
    display += node.name + ' '

  if(node.labels && node.labels.length)
    display += `[${node.labels.join('][')}] `

  if(node.labelNames && node.labelNames.length)
    display += `[${node.labelNames.join('][')}] `

  if(node.value !== undefined)
    display += `#${node.value > 1000?node.value.toExponential():node.value} `

  if(node.date)
    display += `@${moment(node.date).format('YYYY-MM-DD HH:mm')} `

  if(node.text)
    display += `'${node.text}' `

  return display
}
