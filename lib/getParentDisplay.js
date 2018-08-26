const {isOdd} = require('isnot')
const getNodeDisplay = require('./getNodeDisplay')
const {DASH, CHEVRON, FIRST_PARENT, LAST_PARENT, CROSS, HALF_LEFT} = require('./symbols')

module.exports = function (parent, parentIndex, parentsLength){
  const display = getNodeDisplay(parent.node) + getParentRelDisplay(parent.rel) + getParentPipe(parentIndex, parentsLength)
  return display
}

function getParentRelDisplay(rel){
  let display = ''
  if(rel && rel.name)
    display += DASH + rel.name

  return display
}

function getParentPipe(parentIndex, parentsLength){
  let pipe = ''
  if(parentsLength === 1)
    pipe = DASH + CHEVRON

  if(parentsLength > 1){
    if(parentIndex === 0)
      pipe = FIRST_PARENT + ' '
    else if(parentIndex === parentsLength - 1)
      pipe = LAST_PARENT + ' '
    else if(isOdd(parentsLength) && parentIndex === Math.floor(parentsLength/2))
      pipe = CROSS + CHEVRON
    else
      pipe = HALF_LEFT + ' '
  }

  return pipe
}
