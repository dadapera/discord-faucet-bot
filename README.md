# Discord Faucet Bot 
This bot let the users of a Discord server to claim an amount of test token on different testnets, only once every 24 hours.

Already implemented:
- Goerli: ETH, LINK
- Mumbai: MATIC, LINK
- Alfajores: CELO

It use Discord.js for the bot itself and commands, ethers.js for Web3 operations and PostgreSQL for storing claim timestamps. 

## Installation
To use this bot you should add some parameters:

### config.json 

**token**: Discord token, you get it when you register the bot at [Discord developers](https://discord.com/developers/applications).

**MNEMONIC**: Mnemonic string of the wallet used by the bot.

**GOERLI_APY_KEY, MUMBAI_API_KEY, ALFAJORES_API_KEY**: API keys for Web3 provider

### connection.ts

**db**: The PostgreSQL db URL.

**tableName**: Name of the table in PostgreSQL db.

**columnNames**: String of the PostgrSQL db columns.

### Faucet.ts

**tokenAmount**: Amount of token to send for each claim.

**getUserAddress(userId: string)**: The function mapping Discord User ID -> Web3 address needs to be implemented.
