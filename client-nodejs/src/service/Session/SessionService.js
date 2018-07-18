const grpc = require("grpc");
const services = require("./autogenerated/SessionServiceProto");
const TxService = require("./TransactionService");

function SessionService(uri, keyspace, credentials) {
    this.keyspace = keyspace;
    this.credentials = credentials;
    this.stub = new services.SessionServiceClient(uri, grpc.credentials.createInsecure());
}

SessionService.prototype.transaction = async function create(txType) {
    const txService = new TxService(this.stub.transaction());
    await txService.openTx(this.keyspace, txType, this.credentials);
    return txService;
}

SessionService.prototype.close = function close() {
    grpc.closeClient(this.stub);
}

module.exports = SessionService;