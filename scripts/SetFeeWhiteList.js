require('dotenv').config()
const Web3 = require('web3')
const Web3Utils = require('web3-utils')
const assert = require('assert');
const { sendTx, sendRawTx, getReceipt } = require('../helper/sendTx')

const Exchange = require('../abis/Exchange.abi')

const {
  USER_ADDRESS,
  USER_ADDRESS_PRIVATE_KEY,
  EXCHANGE_ADDRESS,
  RPC_URL
} = process.env

const web3Provider = new Web3.providers.HttpProvider(RPC_URL)
const web3Instance = new Web3(web3Provider)

const exchange = new web3Instance.eth.Contract(Exchange, EXCHANGE_ADDRESS)

// - Set the following variables to the desired values
//   - whiteListAddress: Address of user to whitelist token fee

const whiteListAddress = '0x0000000000000000000000000000000000000000'

async function main() {
  const chainId = await sendRawTx({
    url: RPC_URL,
    params: [],
    method: 'net_version'
  })

  let nonce = await sendRawTx({
    url: RPC_URL,
    method: 'eth_getTransactionCount',
    params: [USER_ADDRESS, 'latest']
  })

  nonce = Web3Utils.hexToNumber(nonce)

  const setFeeWhitelist = await exchange.methods
      .setFeeWhitelist(whiteListAddress)
      .encodeABI({ from: USER_ADDRESS })

  try {
    const txHash = await sendTx({
      rpcUrl: RPC_URL,
      privateKey: USER_ADDRESS_PRIVATE_KEY,
      data: setFeeWhitelist,
      nonce,
      gasPrice: '1',
      amount: '0',
      gasLimit: 1000000,
      to: EXCHANGE_ADDRESS,
      web3: web3Instance,
      chainId: chainId
    })

    const txReceipt = await getReceipt(txHash, RPC_URL)
    if (txReceipt.status == '0x1') {
      console.log('transaction succeeded: ', txHash)
    }
  } catch (e) {
    console.log(e)
  }
}

main()
