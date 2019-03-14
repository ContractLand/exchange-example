require('dotenv').config()
const Web3 = require('web3')
const Web3Utils = require('web3-utils')
const assert = require('assert');

const Exchange = require('../abis/Exchange.abi')

const {
  WS_URL
} = process.env

const web3Provider = new Web3.providers.WebsocketProvider(WS_URL)
const web3Instance = new Web3(web3Provider)

async function main() {
  const subscription = web3Instance.eth.subscribe('newBlockHeaders', (error, blockHeader) => {
  if (error) return console.error(error);
    console.log('Successfully subscribed!', blockHeader);
  }).on('data', (blockHeader) => {
    console.log('data: ', blockHeader);
  });
}

main()
