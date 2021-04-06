const thrift = require("thrift");
const GenAST = require("./GenAST.js");
const parser = require("@solidity-parser/parser");

var genASTImpl = {
  genAST: function (sol) {
    console.log(JSON.stringify(parser.parse(sol)));
    console.log("receive: " + JSON.stringify(parser.parse(sol)));
    return JSON.stringify(parser.parse(sol));
  },
};
const server = thrift.createServer(GenAST, genASTImpl);
server.listen(9898);
console.log('Server Started on 9898');
