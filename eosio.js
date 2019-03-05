"use strict";

const colors        = require('colors');
const express        = require('express');
const app            = express();
const MongoClient    = require('mongodb').MongoClient;
const bodyParser     = require('body-parser');
const admin        = require('admin-mongo/app');
/*
add to admin-mongo/config.config.json
{
  "connections": {
    "EOSIO app": {
      "connection_string": "mongodb://127.0.0.1/dapp",
      "connection_options": {}
    }
  }
}
*/
const port = 8000;
app.use(bodyParser.urlencoded({ extended: true }));	

/*********************** SOCKET COLLECT **********************/
const WebSocket = require('ws');
var socket = new WebSocket("wss://ws.eospark.com/v1/ws?apikey=45245293");
socket.onopen = function() {
	console.log('WSS SOCKET connected');
	socket.send( JSON.stringify( {'msg_type': 'subscribe_contract', 'name': 'eosio.token'} ) );
};

var prev_trx = '';
socket.onmessage = function(event) {
	var trx = JSON.parse( event.data );
	if( typeof trx.data.trx_id !== 'string' ){ return; }
	if( prev_trx == trx.data.trx_id ){ return; }
	if( prev_trx != trx.data.trx_id ){ prev_trx = trx.data.trx_id; }
	if( trx.msg_type == 'data' && ( trx.errno == 0 || trx.errmsg == '') && trx.data ){
		try{
			var dataArr = {};
			dataArr.trx_id = trx.data.trx_id; //ba570b33d6c96347bf2c1af94013c522bdf976731601f8fcb1bd5fdbf512d814
			dataArr.block_num = trx.data.block_num; //45822652
			dataArr.trx_timestamp = trx.data.trx_timestamp; //2019-03-04T10:00:05.000
			dataArr.from = '';
			dataArr.to = '';
			dataArr.quantity = '';
			dataArr.token_name = '';
			for( var i = 0; i < trx.data.actions.length; i++) {
				if( trx.data.actions[i].account == 'eosio.token' && trx.data.actions[i].name == 'transfer' ){
					dataArr.from = trx.data.actions[i].data.from //fisimtoken4y
					dataArr.to = trx.data.actions[i].data.to //zvywjf3tg4br
					var token = trx.data.actions[i].data.quantity.split(' '); //0.0001 EOS
					dataArr.quantity = token[0];
					dataArr.token_name = token[1];
					if( dataArr.token_name == 'EOS' ){
						store_trx( dataArr );
					}
				}
			}
		}catch(e){
			console.log( 'WSS Exception -->'.red, e );
		}
	}
};

function store_trx( array ){
	//console.log( 'store_trx -->'.green, array.quantity );
}

/************ DB ***************/
const url = "mongodb://127.0.0.1/dapp";
const mongoClient = new MongoClient(url, { useNewUrlParser: true });
mongoClient.connect(function(err, database){
	if (err){ 
		console.log(err); 
	}else{
		const db = database.db("dapp");
		const Eos_tbl = db.collection("Eos");//STORE TRANSACTIONS + ADDRESS
		const EosTrx_tbl = db.collection("EosTrx");
		
	}
})