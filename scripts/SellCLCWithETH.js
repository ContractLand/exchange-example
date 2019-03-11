require('dotenv').config()
const Web3 = require('web3')
const Web3Utils = require('web3-utils')
const assert = require('assert');
const { sendTx, sendRawTx, getReceipt } = require('../helper/sendTx')

const ERC827 = require('../abis/ERC827.abi')
const Exchange = require('../abis/Exchange.abi')

const {
  USER_ADDRESS,
  USER_ADDRESS_PRIVATE_KEY,
  EXCHANGE_ADDRESS,
  ETH_TOKEN_ADDRESS,
  RPC_URL
} = process.env

const CLC_ADDRESS = '0x0000000000000000000000000000000000000000'

const web3Provider = new Web3.providers.HttpProvider(RPC_URL)
const web3Instance = new Web3(web3Provider)

const erc827 = new web3Instance.eth.Contract(ERC827, ETH_TOKEN_ADDRESS)
const exchange = new web3Instance.eth.Contract(Exchange, EXCHANGE_ADDRESS)

// *** TEST VARIABLES *** //
const NUMBER_OF_TX = 1
const GAS_LIMIT = 1500000
const GAS_PRICE = '1'
const tradeTokenAmount = 1
const tradePrice = 0.00001
const baseTokenAmount = tradeTokenAmount * tradePrice
// *** END OF TEST VARIABLES *** //

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

  let numOfTxSent = 0
    while (numOfTxSent < NUMBER_OF_TX) {
    const sellData = await exchange.methods
        .sell(ETH_TOKEN_ADDRESS, CLC_ADDRESS, USER_ADDRESS, Web3Utils.toWei(tradeTokenAmount.toString()), Web3Utils.toWei(tradePrice.toString()))
        .encodeABI({ from: USER_ADDRESS })

    try {
      const txHash = await sendTx({
        rpcUrl: RPC_URL,
        privateKey: USER_ADDRESS_PRIVATE_KEY,
        data: sellData,
        nonce,
        gasPrice: GAS_PRICE,
        amount: tradeTokenAmount.toString(),
        gasLimit: GAS_LIMIT,
        to: EXCHANGE_ADDRESS,
        web3: web3Instance,
        chainId: chainId
      })

      getReceipt(txHash, RPC_URL).then(txReceipt => {
        if (txReceipt.status == '0x1') {
          console.log('transaction succeeded: ', txHash)
        }
      })
    } catch (e) {
      console.log(e)
    }

    nonce++
    numOfTxSent++
  }
}

main()
