require('dotenv').config()
const Web3 = require('web3')
const Web3Utils = require('web3-utils')
const assert = require('assert');

const Exchange = require('../abis/Exchange.abi')

const {
  USER_ADDRESS,
  USER_ADDRESS_PRIVATE_KEY,
  EXCHANGE_ADDRESS,
  WS_URL,
  ETH_TOKEN_ADDRESS,
  GAS_PRICE
} = process.env

const web3Provider = new Web3.providers.WebsocketProvider(WS_URL)
const web3Instance = new Web3(web3Provider)

const exchange = new web3Instance.eth.Contract(Exchange, EXCHANGE_ADDRESS)

const BASE_TOKEN = ETH_TOKEN_ADDRESS
const TRADE_TOKEN = '0x0000000000000000000000000000000000000000'

async function main() {
  exchange.events.NewTrade({
      filter: {tokenPairHash: getTokenPairHash(BASE_TOKEN, TRADE_TOKEN, Web3Utils)},
      fromBlock: 'latest'
  })
  .on('data', (event) => {
      console.log('on new trade:')
      console.log(event); // Fires on each incoming event with the event object as argument.
  })
  .on('error', console.error) //Fires when an error in the subscription occours.
}

function getTokenPairHash(baseTokenAddress, tradeTokenAddress, web3) {
    const baseTokenStr = (baseTokenAddress).replace(/^0x/, '')
    const tradeTokenStr = (tradeTokenAddress).replace(/^0x/, '')
    const tokenPair = `0x${baseTokenStr}${tradeTokenStr}`
    const hash = web3.sha3(tokenPair, {encoding: 'hex'})
    return hash
}

main()
