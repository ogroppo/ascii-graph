const AsciiTree = require('./lib/AsciiTree');

module.exports = (jsonGraph, options) => new AsciiTree(jsonGraph, options).asciiString
