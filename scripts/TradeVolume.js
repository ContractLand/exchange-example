require('dotenv').config()
const Web3 = require('web3')
const Web3Utils = require('web3-utils')
const assert = require('assert');

const Exchange = require('../abis/Exchange.abi')

const {
  RPC_URL,
  GAS_PRICE
} = process.env

const web3Provider = new Web3.providers.HttpProvider(RPC_URL)
const web3Instance = new Web3(web3Provider)

const EXCHANGE_ADDRESS = '0x9D16394918D18214d6CCc6B4586edae649E3BbB7' // UTOPIA

const exchange = new web3Instance.eth.Contract(Exchange, EXCHANGE_ADDRESS)

const BASE_TOKEN = '0xEb41C988fC445cbA576359B9e9d62A5c76D2BA66' // USDT
const TRADE_TOKEN = '0x58864a85B1F8aE5B370f2AA4177988e2BBb0B88B' // UTOPIA

const todayTimestamp = Math.round(new Date() / 1000)
const lastWeekTimestamp = Math.round(new Date(new Date().setDate(new Date().getDate() - 7)) / 1000)
const WEEK_TIME_RANGE = [lastWeekTimestamp, todayTimestamp]
const TOTAL_TIME_RANGE = [0, 999999999999999]
const LIMIT = 1000000

async function main() {
  try {
    const weeklyTrades = await exchange.methods.getTradeHistory(LIMIT, WEEK_TIME_RANGE, TRADE_TOKEN, BASE_TOKEN).call()

    let WeeklyUSDTTradeVolume = 0;
    let WeeklyUPCTradeVolume = 0;
    for (let i=0; i<weeklyTrades[0].length; i++) {
      WeeklyUSDTTradeVolume += Number(Web3Utils.fromWei(weeklyTrades[2][i]))
      let usdtAmount = Web3Utils.fromWei(weeklyTrades[1][i]) * Web3Utils.fromWei(weeklyTrades[2][i]) // price * amount
      WeeklyUPCTradeVolume += usdtAmount
    }
    console.log('\n========================================')
    console.log('Trading Volume of Past 7 Days')
    console.log('========================================')
    console.log("Trades: ", weeklyTrades[0].length)
    console.log("USDT Volume: ", WeeklyUPCTradeVolume)
    console.log("Utopia Volume: ", WeeklyUSDTTradeVolume)

    const totalTrades = await exchange.methods.getTradeHistory(LIMIT, TOTAL_TIME_RANGE, TRADE_TOKEN, BASE_TOKEN).call()
    let TotalUSDTTradeVolume = 0;
    let TotalUPCTradeVolume = 0;
    for (let i=0; i<totalTrades[0].length; i++) {
      TotalUPCTradeVolume += Number(Web3Utils.fromWei(totalTrades[2][i]))
      let usdtAmount = Web3Utils.fromWei(totalTrades[1][i]) * Web3Utils.fromWei(totalTrades[2][i]) // price * amount
      TotalUSDTTradeVolume += usdtAmount
    }
    console.log('\n========================================')
    console.log('Total Trading Volume')
    console.log('========================================')
    console.log("Trades: ", totalTrades[0].length)
    console.log("USDT Volume: ", TotalUSDTTradeVolume)
    console.log("Utopia Volume: ", TotalUPCTradeVolume)
  } catch (e) {
    console.log(e)
  }

}

main()
