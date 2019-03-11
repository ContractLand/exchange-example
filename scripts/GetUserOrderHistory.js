require('dotenv').config()
const Web3 = require('web3')
const Web3Utils = require('web3-utils')
const assert = require('assert');

const Exchange = require('../abis/Exchange.abi')

const {
  USER_ADDRESS,
  USER_ADDRESS_PRIVATE_KEY,
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
const TIME_RANGE = [0, 999999999999999]
const LIMIT = 1000000

async function main() {
  try {
    const orders = await exchange.methods.getUserOrderHistory(LIMIT, TIME_RANGE, USER_ADDRESS, TRADE_TOKEN, BASE_TOKEN).call()
    console.log("orders size: ", orders[0].length)
  } catch (e) {
    console.log(e)
  }

}

main()
