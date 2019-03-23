var WebSocketClient = require('websocket').client;
var util = require('util')
const Web3 = require('web3');
const Tx = require('ethereumjs-tx');
const InfuraAPI = process.env.Infura;
if (typeof web3 !== 'undefined') {
	web3 = new Web3(web3.currentProvider);
} else {
	web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/v3/" + InfuraAPI));
}
var contract_addr = "0xfa2f5b39daf7f016cec4c2d558c33843110c332c";
var ABI = [
	{
		"constant": false,
		"inputs": [
			{
				"name": "hash",
				"type": "string"
			},
			{
				"name": "id",
				"type": "string"
			}
		],
		"name": "setAddr",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_id",
				"type": "string"
			}
		],
		"name": "getAddr",
		"outputs": [
			{
				"name": "",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}
]
web3.eth.defaultAccount = '0xA3ce0602b7f1fe4A0B47fDc35B3A85b631ad6605';
let addr1 = "0xA3ce0602b7f1fe4A0B47fDc35B3A85b631ad6605";
var privateKey = Buffer.from('1F98F4EB56F3673B23BBBD6316A3F5E64C6C077008F3C3726BB3D5F53F72C1E3', 'hex')

var contract = new web3.eth.Contract(ABI, contract_addr);
const setAddr = (id, hash, callback) => {
	web3.eth.getTransactionCount("0xA3ce0602b7f1fe4A0B47fDc35B3A85b631ad6605", (err, txCount) => {
		if (err) throw err;
		console.log(txCount)
		var amount = web3.utils.toHex(1e16);
		var rawTransaction = { "from": addr1, "gasPrice": web3.utils.toHex(20 * 1e9), "gasLimit": web3.utils.toHex(210000), "to": contract_addr, "value": "0x0", "data": contract.methods.setAddr(hash.toString(), id.toString()).encodeABI(), "nonce": web3.utils.toHex(txCount) }
		var transaction = new Tx(rawTransaction);
		transaction.sign(privateKey);
		web3.eth.sendSignedTransaction('0x' + transaction.serialize().toString('hex'))
			.on('transactionHash', (txnId) => {
				callback(null, txnId);
			});

	});
}


const getAddr = (id, callback) => {
	contract.methods.getAddr(id).call()
		.then((data) => {
			callback(null, data);
		});
}
module.exports = { setAddr, getAddr };