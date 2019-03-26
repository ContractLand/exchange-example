require('dotenv').config()
const Web3 = require('web3')
const Web3Utils = require('web3-utils')
const assert = require('assert');
const { sendTx, sendRawTx, getReceipt } = require('../helper/sendTx')

const Exchange = require('../abis/Exchange.abi')

const {
  EXCHANGE_ADDRESS,
  RPC_URL,
  ETH_TOKEN_ADDRESS,
  GAS_PRICE
} = process.env

const web3Provider = new Web3.providers.HttpProvider(RPC_URL)
const web3Instance = new Web3(web3Provider)

const exchange = new web3Instance.eth.Contract(Exchange, EXCHANGE_ADDRESS)

const BASE_TOKEN = ETH_TOKEN_ADDRESS
const TRADE_TOKEN = '0x0000000000000000000000000000000000000000'
const LIMIT = 500

async function main() {
  try {
    const asks = await exchange.methods.getAsks(LIMIT, TRADE_TOKEN, BASE_TOKEN)
    console.log("asks size: ", asks[0].length)

    const bids = await exchange.methods.getBids(LIMIT, TRADE_TOKEN, BASE_TOKEN)
    console.log("bids size: ", bids[0].length)
  } catch (e) {
    console.log(e)
  }

}

main()
