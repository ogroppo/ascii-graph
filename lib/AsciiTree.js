const {isOdd, isEven} = require('isnot')
const getNodeDisplay = require('./getNodeDisplay')
const getChildDisplay = require('./getChildDisplay')
const getParentDisplay = require('./getParentDisplay')
const {FIRST_CHILD, LAST_CHILD, FIRST_PARENT, LAST_PARENT, HALF_RIGHT, HALF_LEFT, CHEVRON, VERTICAL} = require('./symbols')

module.exports = class AsciiTree{
  constructor(jsonGraph, options = {}){
    this.json = jsonGraph
    this.options = options

    this.graphWidth = 0
    this.minLeft = 0
    this.minTop = 0

    this.mapElements()
    this.setAscii()
  }

  mapElements(){
    this.elements = []
    let display = getNodeDisplay(this.json.node)
    this.elements.push({
      display,
      row: 0,
      depth: 0,
      left: 0
    })
    this.mapParents(this.json.parents)
    this.mapChildren(this.json.children, 0, 1, display.length)
  }

  mapParents(parents, originRow = 0, parentDepth = -1, currentLeft = 0){
    if(!parents || !parents.length)
      return

    const halfParentsLength = parents.length/2

    //make space
    if(parents.length > 1){
      let moveAmount = Math.floor(halfParentsLength)
      if(originRow < 0){
        this.moveTopParents(originRow, parentDepth,moveAmount)
        originRow -= moveAmount
      }
      if(originRow > 0){
        this.moveBottomParents(originRow, moveAmount)
        originRow += moveAmount
      }
      if(originRow === 0){
        this.moveTopParents(-1, parentDepth, moveAmount)
        this.moveBottomParents(1, moveAmount)
      }
    }

    if(isEven(parents.length)) { //even parents, so has gap
      this.elements.push({
        display: HALF_RIGHT + CHEVRON,
        row: originRow,
        depth: parentDepth,
        left: currentLeft - 2 //It's own length
      })
    }

    parents.forEach((parent, parentIndex) => {
      let display = getParentDisplay(parent, parentIndex, parents.length)
      let parentLeft = currentLeft - display.length

      let parentRow = originRow + parentIndex;
      if(isOdd(parents.length)) { //odd
        parentRow -= Math.floor(halfParentsLength)
      }else{ //even
        if(parentIndex < halfParentsLength) //top half
          parentRow -= halfParentsLength
        else
          parentRow -= (halfParentsLength)-1 //bottom half
      }

      this.updateMinTop(parentRow)
      this.updateMinLeft(parentLeft)

      this.elements.push({
        display,
        row: parentRow,
        depth: parentDepth,
        left: parentLeft
      })
    })

    //now that they're all added carry on
    this.elements.slice(-parents.length).forEach((parent, parentIndex) => {
      this.mapParents(parents[parentIndex].parents, parent.row, parent.depth - 1, parent.left)
    })
  }

  mapChildren(children, originRow, childDepth, currentLeft){
    if(!children || !children.length)
      return

    const halfChildrenLength = children.length/2

    //make space
    if(children.length > 1){
      let halfOverflow = Math.floor(halfChildrenLength)
      if(originRow < 0){
        this.moveTopChildren(originRow, halfOverflow)
        originRow -= halfOverflow
        this.moveTopChildren(originRow + halfOverflow, halfOverflow)
      }
      if(originRow > 0){
        //move all children with origin
        this.moveBottomChildren(originRow, halfOverflow)
        originRow += halfOverflow
        //move again the ones below origin
        this.moveBottomChildren(originRow + halfOverflow, halfOverflow)
      }
      if(originRow === 0){
        this.moveTopChildren(-1, halfOverflow)
        this.moveBottomChildren(1, halfOverflow)
      }
    }

    if(isEven(children.length)){
      this.elements.push({
        display: HALF_LEFT,
        row: originRow,
        depth: childDepth,
        left: currentLeft
      })
    }

    children.forEach((child, childIndex) => {
      let childRow = originRow + childIndex; //start from origin + index

      if(isOdd(children.length)){ //then subtract helf compensation
        childRow -= Math.floor(halfChildrenLength)
      }else{ //even
        if(childIndex < halfChildrenLength)
          childRow -= halfChildrenLength //top half
        else
          childRow -= halfChildrenLength - 1 //bottom half accounts for gap
      }
      this.updateMinTop(childRow)

      let display = getChildDisplay(child, childIndex, children.length)
      this.elements.push({
        display,
        row: childRow,
        depth: childDepth,
        left: currentLeft
      })
    })

    //now that they're all added carry on
    this.elements.slice(-children.length).forEach((child, childIndex) => {
      this.mapChildren(children[childIndex].children, child.row, child.depth + 1, child.left + child.display.length)
    })
  }

  moveTopChildren(fromRow, moveAmount){
    this.elements.forEach((connector, connectorIndex) => {
      //top children
      if(connector.depth > 0 && connector.row <= fromRow){
        if(connector.row === fromRow && !connector.display.startsWith(LAST_CHILD) ){
          //add vertical pipes
          for (var i = 0; i < moveAmount; i++) {
            this.elements.push({
              display: VERTICAL,
              left: connector.left,
              row: fromRow - i,
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
    this.elements.forEach((element, elementIndex) => {
      //top children
      if(element.depth < 0 && element.row <= fromRow){
        if(element.depth === fromRow && !element.display.endsWith(LAST_PARENT + ' ') ){
          //add vertical pipes, but there might be some vertical pipes already
          for (var i = 0; i < moveAmount; i++) {
            this.elements.push({
              display: VERTICAL + ' ',
              left: element.left + element.display.length - 2, //MINUS it's own length
              row: fromRow - i,
              depth: element.depth
            })
          }
        }
        element.row -= moveAmount
        this.updateMinTop(element.row)
      }
    })
  }

  moveBottomChildren(fromRow, moveAmount){
    this.elements.forEach((element, elementIndex) => {
      if(element.depth > 0 && element.row >= fromRow){
        if(element.row === fromRow && //add vertical pipes, only once
          !element.display.startsWith(FIRST_CHILD)){ // and if it's not the first child
          for (var i = 0; i < moveAmount; i++) {
            this.elements.push({
              display: VERTICAL,
              left: element.left,
              row: fromRow + i,
              depth: element.depth
            })
          }
        }
        element.row += moveAmount
      }
    })
  }

  moveBottomParents(fromRow, moveAmount){
    this.elements.forEach((element, elementIndex) => {
      //if it's bottom and parent
      if(element.depth < 0 && element.row >= fromRow){
        //add vertical pipes
        if(element.row === fromRow && //only for one element (once)
          !element.display.endsWith(FIRST_PARENT + ' ') ){ // and if it's not the first parent
          for (var i = 0; i < moveAmount; i++) {
            this.elements.push({
              display: VERTICAL + ' ',
              left: element.left + element.display.length - 2,
              row: element.row + i,
              depth: element.depth
            })
          }
        }
        element.row += moveAmount
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

  updateGraphWith(val){
    if(val > this.graphWidth)
      this.graphWidth = val
  }

  setAscii(){
    this.asciiString = ''
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
      this.updateGraphWith(row.length)
    })

    if(this.options.title){
      rows.unshift("")
      let halfTitleLength = Math.floor(this.options.title.length/2)
      let placeholder = '#'.repeat(this.graphWidth/2 - halfTitleLength - 1)
      let title = ' ' + this.options.title + ' '
      rows.unshift(placeholder + title + placeholder)
    }

    this.asciiString = rows.join('\n')
  }
}
