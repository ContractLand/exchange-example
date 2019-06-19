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
    const asks = await exchange.methods.getAggregatedAsks(LIMIT, TRADE_TOKEN, BASE_TOKEN).call()
    console.log("asks size: ", asks[0].length)
    printOrder(asks)

    const bids = await exchange.methods.getAggregatedBids(LIMIT, TRADE_TOKEN, BASE_TOKEN).call()
    console.log("bids size: ", bids[0].length)
    printOrder(bids)
  } catch (e) {
    console.log(e)
  }
}

function printOrder(orders) {
    console.log('price, amount')
    for (let i=0; i<orders[0].length; i++) {
      // print price and amount
      console.log(Web3Utils.fromWei(orders[0][i], 'ether'), ', ', Web3Utils.fromWei(orders[1][i], 'ether'))
    }
}

main()
