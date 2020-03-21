require('dotenv').config()
const Web3 = require('web3')
const Web3Utils = require('web3-utils')
const assert = require('assert');
const { sendTx, sendRawTx, getReceipt } = require('../helper/sendTx')

const Exchange = require('../abis/Exchange.abi')

const {
  USER_ADDRESS,
  USER_ADDRESS_PRIVATE_KEY,
  RPC_URL
} = process.env

const web3Provider = new Web3.providers.HttpProvider(RPC_URL)
const web3Instance = new Web3(web3Provider)

const addresses = []
async function main() {
  for (let i = 0; i < addresses.length; i++) {
      let tx = await web3.eth.sendTransaction({
        from: USER_ADDRESS,
        to: addresses[i],
        value:web3.toWei(amount_in_ether,"ether")}
      })
  }

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

main()
