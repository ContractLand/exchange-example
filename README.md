# Exchange-Example
This is an example DApp to interact with the exchange contracts.

## Install
`npm install`

## To Perform Exchange Operations

<<<<<<< HEAD
=======
1. Make copy of `.env.example` file and rename to `.env`.
>>>>>>> 2ba568c60acf216b69c0545cfe3ebe9c4483e9f7
1. Populate `USER_ADDRESS` and `USER_ADDRESS_PRIVATE_KEY` in `.env`. This is the account where the transactions will be made from. `USER_ADDRESS_PRIVATE_KEY` need to be provided without '0x' prefix.
2. Use provided scripts for making transactions:

    - Buy CLC with ETH: `node scripts/BuyCLCWithETH.js`
    - Sell CLC for ETH: `node scripts/SellCLCWithETH.js`
<<<<<<< HEAD
    - Cancel Order: `node scripts/CancelOrder.js`. Need to modify `orderId` variable in script.
=======
    - Cancel Order: `node scripts/CancelOrder.js`. Need to modify `orderId` variable in script.
>>>>>>> 2ba568c60acf216b69c0545cfe3ebe9c4483e9f7
