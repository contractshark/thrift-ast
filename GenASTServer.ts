// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var thrift = require('thrift');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var GenAST = require('./GenAST.js');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var parser = require('@solidity-parser/parser');

var genASTImpl = {
  genAST: function (sol) {
    console.log(JSON.stringify(parser.parse(sol)));
    console.log('receive: ' + JSON.stringify(parser.parse(sol)));
    return JSON.stringify(parser.parse(sol));
  },
};
var server = thrift.createServer(GenAST, genASTImpl);
server.listen(9898);
