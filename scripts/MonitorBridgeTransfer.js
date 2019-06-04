require('dotenv').config()
const Web3 = require('web3')
const Web3Utils = require('web3-utils')
const assert = require('assert');

const ForeignBridge = require('../abis/ForeignBridge.abi')

const PROCESS_TIMEOUT_INTERVAL = 2000 // 2s
const RPC_URL = 'https://mainnet.infura.io/v3/2e39094c865b4cdb90e122214b57ad04'
// const RPC_URL = 'https://ropsten.infura.io/v3/2e39094c865b4cdb90e122214b57ad04'

const web3Provider = new Web3.providers.HttpProvider(RPC_URL)
const web3Instance = new Web3(web3Provider)

const TOKEN_ADDRESS = '0x...'
const bridge = new web3Instance.eth.Contract(ForeignBridge, TOKEN_ADDRESS)

let fromBlock = 0
let toBlock = latest

const blacklist = [
  '0x...',
  '0x...'
]

async function main() {
  const currentBlockNumber = await getBlockNumber(web3Instance)

  for(let i=0; i<blacklist.length; i++) {
    await getBridgeTransferEvents(blacklist[i], currentBlockNumber)
  }

  setTimeout(() => {
    main()
  }, PROCESS_TIMEOUT_INTERVAL)
}

async function getBridgeTransferEvents(fromAddress, lastProceededBlock) {
  const events = await bridge.getPastEvents('TransferFromHome', {
      filter: {
        from: fromAddress
      },
      fromBlock: lastProceededBlock,
      toBlock: 'latest'
  })

  for(let i=0; i<events.length; i++) {
    console.log(`\n[${getCurrentDateTime()}]`)
    console.log('Found transfer from Ethereum into Terra from: ', fromAddress)
  }
}

async function getBlockNumber(web3) {
  try {
    const blockNumber = await web3.eth.getBlockNumber()
    return blockNumber
  } catch (e) {
    throw new Error(`Block Number cannot be obtained`)
  }
}

function getCurrentDateTime() {
  const now = new Date();
  const est = "America/Toronto";
  const format= "YYYY-MM-DD hh:mm:ss a z";
  const dateTime = moment(now).tz(est).format(format);
  return dateTime
}

main()
