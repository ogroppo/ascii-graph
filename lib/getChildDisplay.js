const {isOdd} = require('isnot')
const getNodeDisplay = require('./getNodeDisplay')
const {CHEVRON, DASH, CROSS, FIRST_CHILD, LAST_CHILD, HALF_RIGHT} = require('./symbols')

module.exports = function getChildDisplay(child, childIndex, childrenLength){
  let display = getChildPipe(childIndex, childrenLength) + getChildRelDisplay(child.rel) + getNodeDisplay(child.node)
  return display
}

function getChildRelDisplay(rel){
  let display = ''
  if(rel && rel.name)
    display += rel.name + DASH

  display += CHEVRON

  return display
}

function getChildPipe(childIndex, childrenLength) {

  let pipe = ''
  if(childrenLength === 1){
    pipe = DASH
  }else if(childrenLength > 1){
    if(childIndex === 0)
      pipe = FIRST_CHILD
    else if(childIndex === childrenLength - 1)
      pipe = LAST_CHILD
    else if(isOdd(childrenLength) && childIndex === Math.floor(childrenLength/2))
      pipe = CROSS
    else
      pipe = HALF_RIGHT
  }

  return pipe
}
