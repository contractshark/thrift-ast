"use strict";

var thrift = require("thrift");
var Thrift = thrift.Thrift;
var Q = thrift.Q;

var ttypes = require("./GenAST_types");

var GenAST_genAST_args = function (args) {
  this.sol = null;
  if (args) {
    if (args.sol !== undefined && args.sol !== null) {
      this.sol = args.sol;
    }
  }
};
GenAST_genAST_args.prototype = {};
GenAST_genAST_args.prototype.read = function (input) {
  input.readStructBegin();
  while (true) {
    var ret = input.readFieldBegin();
    var ftype = ret.ftype;
    var fid = ret.fid;
    if (ftype == Thrift.Type.STOP) {
      break;
    }
    switch (fid) {
      case 1:
        if (ftype == Thrift.Type.STRING) {
          this.sol = input.readString();
        } else {
          input.skip(ftype);
        }
        break;
      case 0:
        input.skip(ftype);
        break;
      default:
        input.skip(ftype);
    }
    input.readFieldEnd();
  }
  input.readStructEnd();
};

GenAST_genAST_args.prototype.write = function (output) {
  output.writeStructBegin("GenAST_genAST_args");
  if (this.sol !== null && this.sol !== undefined) {
    output.writeFieldBegin("sol", Thrift.Type.STRING, 1);
    output.writeString(this.sol);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
};

var GenAST_genAST_result = function (args) {
  this.success = null;
  if (args) {
    if (args.success !== undefined && args.success !== null) {
      this.success = args.success;
    }
  }
};
GenAST_genAST_result.prototype = {};
GenAST_genAST_result.prototype.read = function (input) {
  input.readStructBegin();
  while (true) {
    var ret = input.readFieldBegin();
    var ftype = ret.ftype;
    var fid = ret.fid;
    if (ftype == Thrift.Type.STOP) {
      break;
    }
    switch (fid) {
      case 0:
        if (ftype == Thrift.Type.STRING) {
          this.success = input.readString();
        } else {
          input.skip(ftype);
        }
        break;
      case 0:
        input.skip(ftype);
        break;
      default:
        input.skip(ftype);
    }
    input.readFieldEnd();
  }
  input.readStructEnd();
};

GenAST_genAST_result.prototype.write = function (output) {
  output.writeStructBegin("GenAST_genAST_result");
  if (this.success !== null && this.success !== undefined) {
    output.writeFieldBegin("success", Thrift.Type.STRING, 0);
    output.writeString(this.success);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
};

var GenASTClient = (exports.Client = function (output, pClass) {
  this.output = output;
  this.pClass = pClass;
  this._seqid = 0;
  this._reqs = {};
});
GenASTClient.prototype = {};
GenASTClient.prototype.seqid = function () {
  return this._seqid;
};
GenASTClient.prototype.new_seqid = function () {
  return (this._seqid += 1);
};

GenASTClient.prototype.genAST = function (sol, callback) {
  this._seqid = this.new_seqid();
  if (callback === undefined) {
    var _defer = Q.defer();
    this._reqs[this.seqid()] = function (error, result) {
      if (error) {
        _defer.reject(error);
      } else {
        _defer.resolve(result);
      }
    };
    this.send_genAST(sol);
    return _defer.promise;
  } else {
    this._reqs[this.seqid()] = callback;
    this.send_genAST(sol);
  }
};

GenASTClient.prototype.send_genAST = function (sol) {
  var output = new this.pClass(this.output);
  var params = {
    sol: sol,
  };
  var args = new GenAST_genAST_args(params);
  try {
    output.writeMessageBegin("genAST", Thrift.MessageType.CALL, this.seqid());
    args.write(output);
    output.writeMessageEnd();
    return this.output.flush();
  } catch (e) {
    delete this._reqs[this.seqid()];
    if (typeof output.reset === "function") {
      output.reset();
    }
    throw e;
  }
};

GenASTClient.prototype.recv_genAST = function (input, mtype, rseqid) {
  var callback = this._reqs[rseqid] || function () {};
  delete this._reqs[rseqid];
  if (mtype == Thrift.MessageType.EXCEPTION) {
    var x = new Thrift.TApplicationException();
    x.read(input);
    input.readMessageEnd();
    return callback(x);
  }
  var result = new GenAST_genAST_result();
  result.read(input);
  input.readMessageEnd();

  if (null !== result.success) {
    return callback(null, result.success);
  }
  return callback("genAST failed: unknown result");
};
var GenASTProcessor = (exports.Processor = function (handler) {
  this._handler = handler;
});
GenASTProcessor.prototype.process = function (input, output) {
  var r = input.readMessageBegin();
  if (this["process_" + r.fname]) {
    return this["process_" + r.fname].call(this, r.rseqid, input, output);
  } else {
    input.skip(Thrift.Type.STRUCT);
    input.readMessageEnd();
    var x = new Thrift.TApplicationException(
      Thrift.TApplicationExceptionType.UNKNOWN_METHOD,
      "Unknown function " + r.fname
    );
    output.writeMessageBegin(r.fname, Thrift.MessageType.EXCEPTION, r.rseqid);
    x.write(output);
    output.writeMessageEnd();
    output.flush();
  }
};
GenASTProcessor.prototype.process_genAST = function (seqid, input, output) {
  var args = new GenAST_genAST_args();
  args.read(input);
  input.readMessageEnd();
  if (this._handler.genAST.length === 1) {
    Q.fcall(this._handler.genAST.bind(this._handler), args.sol)
      .then(function (result) {
        var result_obj = new GenAST_genAST_result({ success: result });
        output.writeMessageBegin("genAST", Thrift.MessageType.REPLY, seqid);
        result_obj.write(output);
        output.writeMessageEnd();
        output.flush();
      })
      .catch(function (err) {
        var result;
        result = new Thrift.TApplicationException(
          Thrift.TApplicationExceptionType.UNKNOWN,
          err.message
        );
        output.writeMessageBegin("genAST", Thrift.MessageType.EXCEPTION, seqid);
        result.write(output);
        output.writeMessageEnd();
        output.flush();
      });
  } else {
    this._handler.genAST(args.sol, function (err, result) {
      var result_obj;
      if (err === null || typeof err === "undefined") {
        result_obj = new GenAST_genAST_result(
          err !== null || typeof err === "undefined" ? err : { success: result }
        );
        output.writeMessageBegin("genAST", Thrift.MessageType.REPLY, seqid);
      } else {
        result_obj = new Thrift.TApplicationException(
          Thrift.TApplicationExceptionType.UNKNOWN,
          err.message
        );
        output.writeMessageBegin("genAST", Thrift.MessageType.EXCEPTION, seqid);
      }
      result_obj.write(output);
      output.writeMessageEnd();
      output.flush();
    });
  }
};
