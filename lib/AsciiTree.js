const {isOdd, isEven} = require('isnot')

module.exports = class AsciiTree{
  constructor(jsonGraph, options = {}){
    this.json = jsonGraph
    this.options = options

    this.asciiString = ''
    this.elements = []
    this.minLeft = 0
    this.minTop = 0

    this.mapRoot()
    this.mapParents(this.json.parents)
    this.mapChildren(this.json.children, 0, 1, this.elements[0].display.length)

    this.setAscii()
  }

  mapRoot(){
    let display = this.getNodeDisplay(this.json.node)
    this.elements.push({
      display,
      row: 0,
      depth: 0,
      left: 0
    })
  }

  mapParents(parents, originRow = 0, parentDepth = -1, currentLeft = 0){
    if(!parents)
      return

    const halfParentsLength = parents.length/2

    //make space
    if(parents.length > 1){
      let moveAmount = Math.floor(halfParentsLength)
      if(originRow < 0){
        this.moveTopParents(originRow, moveAmount)
        originRow -= moveAmount
      }
      if(originRow > 0){
        this.moveBottomParents(originRow, moveAmount)
        originRow += moveAmount
      }
      if(originRow === 0){
        this.moveTopParents(originRow - 1, moveAmount)
        this.moveBottomParents(originRow + 1, moveAmount)
      }
    }

    if(isEven(parents.length)) { //even parents, so has gap
      this.elements.push({
        display: '├›',
        row: originRow,
        depth: parentDepth,
        left: currentLeft - 2 //It's own length
      })
    }

    parents.forEach((parent, parentIndex) => {
      let display = this.getParentDisplay(parent, parentIndex, parents)
      let parentLeft = currentLeft - display.length

      let parentRow = originRow + parentIndex;
      if(isOdd(parents.length)) { //odd
        parentRow -= Math.floor(halfParentsLength)
      }else{ //even
        if(parentIndex < halfParentsLength) //top half
          parentRow -= halfParentsLength
        else
          parentRow -= (halfParentsLength)-1 //bottom hal
      }

      this.updateMinTop(parentRow)
      this.updateMinLeft(parentLeft)

      this.elements.push({
        display,
        row: parentRow,
        depth: parentDepth,
        left: parentLeft
      })

      this.mapParents(parent.parents, parentRow, parentDepth - 1, parentLeft)
    })
  }

  mapChildren(children, originRow, currentDepth, currentLeft){
    if(!children)
      return

    const halfChildrenLength = children.length/2

    //make space
    if(children.length > 1){
      let moveAmount = Math.floor(halfChildrenLength)
      if(originRow < 0){
        this.moveTopChildren(originRow, moveAmount)
        originRow -= moveAmount
      }
      if(originRow > 0){
        this.moveBottomChildren(originRow, moveAmount)
        originRow += moveAmount
      }
      if(originRow === 0){
        this.moveTopChildren(originRow - 1, moveAmount)
        this.moveBottomChildren(originRow + 1, moveAmount)
      }
    }

    if(isEven(children.length)){
      this.elements.push({
        display: '┤',
        row: originRow,
        depth: currentDepth,
        left: currentLeft
      })
    }

    children.forEach((child, childIndex) => {
      let display = this.getChildDisplay(child, childIndex, children)

      let childRow = originRow + childIndex;
      if(isOdd(children.length)){
        childRow -= Math.floor(halfChildrenLength)
      }else{ //even
        if(childIndex < halfChildrenLength)
          childRow -= halfChildrenLength //top half
        else
          childRow -= halfChildrenLength - 1 //bottom half accounts for gap
      }

      this.updateMinTop(childRow)

      this.elements.push({
        display,
        row: childRow,
        depth: currentDepth,
        left: currentLeft
      })
      this.mapChildren(child.children, childRow, currentDepth + 1, currentLeft + display.length)
    })
  }

  moveTopChildren(fromRow, moveAmount){
    this.elements.forEach((connector, connectorIndex) => {
      //top children
      if(connector.depth > 0 && connector.row <= fromRow){
        if(connector.row === fromRow && connector.display.startsWith('╭') ){
          //add vertical pipes
          for (var i = 0; i < moveAmount; i++) {
            this.elements.push({
              display: '│',
              left: connector.left,
              row: connector.row - i,
              depth: connector.depth
            })
          }
        }
        connector.row -= moveAmount
        this.updateMinTop(connector.row)
      }
    })
  }

  moveTopParents(fromRow, moveAmount){
    this.elements.forEach((connector, connectorIndex) => {
      //top children
      if(connector.depth < 0 && connector.row <= fromRow){
        if(connector.row === fromRow && connector.display.endsWith('╮ ') ){
          //add vertical pipes
          for (var i = 0; i < moveAmount; i++) {
            this.elements.push({
              display: '│ ',
              left: connector.left + connector.display.length - 2, //MINUS it's own length
              row: connector.row - i,
              depth: connector.depth
            })
          }
        }
        connector.row -= moveAmount
        this.updateMinTop(connector.row)
      }
    })
  }

  updateMinTop(val){
    if(val < this.minTop)
      this.minTop = val
  }

  updateMinLeft(val){
    if(val < this.minLeft)
      this.minLeft = val
  }

  moveBottomChildren(fromRow, moveAmount){
    this.elements.forEach((connector, connectorIndex) => {
      //top children
      if(connector.depth > 0 && connector.row >= fromRow){
        if(connector.row === fromRow && connector.display[0] === '╰'){
          //add vertical pipes
          for (var i = 0; i < moveAmount; i++) {
            this.elements.push({
              display: '│',
              left: connector.left,
              row: connector.row + i,
              depth: connector.depth
            })
          }
        }
        connector.row += moveAmount
      }
    })
  }

  moveBottomParents(fromRow, moveAmount){
    this.elements.forEach((connector, connectorIndex) => {
      //top children
      if(connector.depth < 0 && connector.row >= fromRow){
        if(connector.row === fromRow && connector.display.endsWith('╯ ') ){
          //add vertical pipes
          for (var i = 0; i < moveAmount; i++) {
            this.elements.push({
              display: '│ ',
              left: connector.left + connector.display.length - 2,
              row: connector.row + i,
              depth: connector.depth
            })
          }
        }
        connector.row += moveAmount
      }
    })
  }

  getParentDisplay(parent, parentIndex, parents){
    let pipe = parent.rel && parent.rel.name?('─'+parent.rel.name):''
    if(parents.length === 1){
      pipe += '─›'
    }
    if(parents.length > 1){
      if(parentIndex === 0)
        pipe += '╮ '
      else if(parentIndex === parents.length - 1)
        pipe += '╯ '
      else if(isOdd(parents.length) && parentIndex === Math.floor(parents.length/2))
        pipe += '┼›'
      else
        pipe += '┤ '
    }
    return this.getNodeDisplay(parent.node) + pipe
  }

  getChildDisplay(child, childIndex, children){
    let pipe = ''
    if(children.length === 1){
      pipe += '─'
    }
    if(children.length > 1){
      if(childIndex === 0)
        pipe += '╭'
      else if(childIndex === children.length - 1)
        pipe += '╰'
      else if(isOdd(children.length) && childIndex === Math.floor(children.length/2))
        pipe += '┼'
      else
        pipe += '├'

    }
    pipe += (child.rel && child.rel.name?(child.rel.name+'─'):'') + '›'
    return pipe + this.getNodeDisplay(child.node)
  }

  getNodeDisplay(node){
    let display = ''
    if(node.name)
      display += ' ' + node.name + ' '
    if(node.labels && node.labels.length)
      display += `[${node.labels.join('][')}] `
    return display
  }

  setAscii(){
    let rows = []
    this.elements.forEach(connector => {
      let normalizedLeft = connector.left - this.minLeft
      let normalizedRow = connector.row - this.minTop
      let row = rows[normalizedRow] || ''
      if(row.length < normalizedLeft){
        row += ' '.repeat(normalizedLeft - row.length)
      }
      row = row.slice(0, normalizedLeft) + connector.display + row.slice(normalizedLeft + connector.display.length)
      rows[normalizedRow] = row
    })

    this.asciiString = rows.join('\n')
  }
}
