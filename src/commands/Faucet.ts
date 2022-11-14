import { CommandInteraction, Client, } from "discord.js";
import { Command } from "../Command";
import { ethers, Wallet, providers, Contract } from "ethers"
import {checkTimeout, updateRecord} from '../server/services'
import {successfulMsg, failedMsg, sendingMsg, waitingMsg, waitOneDayMsg} from '../Replies'

const { MNEMONIC }  = require("../../config.json")
const { GOERLI_API_KEY }  = require("../../config.json")
const { MUMBAI_API_KEY }  = require("../../config.json")
const CHAINLINK_ABI = require("../contracts/Chainlink.json")

const tokenAmount:string = "1.0"

var interaction:CommandInteraction 

function getUserAddress(userId: string){
    //to be implemented by LearnWeb3
    return "0x000000000000000000000000000000000000dEaD"  
}

async function send(userAddress: string, network: string, token: string) {
    let tx

    async function sendNativeCoin(userAddress: string, wallet: Wallet ){

        let pkg = {
            to: userAddress,
            value: ethers.utils.parseEther(tokenAmount)
        };

        try{
        
            tx = await wallet.sendTransaction(pkg);
        
        } catch (err){
           
            console.log(err)
            await failedMsg(interaction)
            throw new Error("Transaction gone wrong!");
        }
        return tx
    }

    async function sendToken(userAddress: string, contract: Contract ){
        let tx
        try{
            tx = await contract.transfer(userAddress, ethers.utils.parseEther(tokenAmount))
        }catch(err){
            console.log(err)
            await failedMsg(interaction)
            throw new Error("Something gone wrong!");
        }
        return tx
    }

    if(network === "goerli" && token === "eth"){
        
        const provider = new providers.EtherscanProvider("goerli", GOERLI_API_KEY);
        const wallet = Wallet.fromMnemonic(MNEMONIC).connect(provider)
        tx = await sendNativeCoin(userAddress, wallet)
    }
    if(network === "goerli" && token === "link"){

        const provider = new providers.EtherscanProvider("goerli", GOERLI_API_KEY);
        const wallet = Wallet.fromMnemonic(MNEMONIC).connect(provider)
        const contract = new ethers.Contract("0x326C977E6efc84E512bB9C30f76E30c160eD06FB", CHAINLINK_ABI, wallet)
        tx = await sendToken(userAddress, contract)
    }
    if(network === "mumbai" && token === "matic"){

        const provider = new providers.EtherscanProvider("maticmum", MUMBAI_API_KEY);
        const wallet = Wallet.fromMnemonic(MNEMONIC).connect(provider)
        tx = await sendNativeCoin(userAddress, wallet)
    }
    if(network === "mumbai" && token === "link"){

        const provider = new providers.EtherscanProvider("maticmum", MUMBAI_API_KEY);
        const wallet = Wallet.fromMnemonic(MNEMONIC).connect(provider)
        const contract = new ethers.Contract("0x326C977E6efc84E512bB9C30f76E30c160eD06FB", CHAINLINK_ABI, wallet)
        tx = await sendToken(userAddress, contract)
    }
    if(network === "alfajores" && token === "celo"){
  
        const provider = new providers.JsonRpcProvider("https://alfajores-forno.celo-testnet.org");
        const wallet = Wallet.fromMnemonic(MNEMONIC).connect(provider)
        tx = await sendNativeCoin(userAddress, wallet)
    }
    
    return tx
}

async function handler() {
    //user id
    const userId = interaction.user.id
    //network & token
    const network = interaction.options.data[0].name
    const token = interaction.options.data[0].options?.at(0)?.name
    
    if (token === undefined) {
        await failedMsg(interaction)
        return
    }
    //24h have passed?
    if(await checkTimeout(userId, network, token)){

        const userAddress = getUserAddress(userId)
        
        await sendingMsg(interaction, network, token, tokenAmount, userAddress) 

        //actually send token
        let tx = await send(userAddress, network, token) 
        
        await waitingMsg(interaction)

        //wait and show transaction result
        let receipt = await tx.wait();
        if(receipt.status === 1){
            await updateRecord(userId, network, token)
            await successfulMsg(interaction, receipt.transactionHash)

        } else if(receipt.status === 0){
            await failedMsg(interaction)

        }
    } else {
        waitOneDayMsg(interaction)
    }
}

export const Faucet: Command = {
    name: "faucet",
    "description": "Get Testnet token",
    options: [
        {
            "name": "goerli",
            "description": "Ethereum Goerli testnet",
            "type": 2, // 2 is type SUB_COMMAND_GROUP
            "options": [
                {
                    "name": "eth",
                    "description": "Ethereum coin",
                    "type": 1 // 1 is type SUB_COMMAND
                },
                {
                    "name": "link",
                    "description": "ChainLink token",
                    "type": 1
                }
            ]
        },
        {
            "name": "mumbai",
            "description": "Polygon Mumbai testnet",
            "type": 2,
            "options": [
                {
                    "name": "matic",
                    "description": "Matic coin",
                    "type": 1
                },
                {
                    "name": "link",
                    "description": "ChainLink token",
                    "type": 1
                }
            ]
        },
        {
            "name": "alfajores",
            "description": "Celo Alfajores testnet",
            "type": 2,
            "options": [
                {
                    "name": "celo",
                    "description": "Celo coin",
                    "type": 1
                }
            ]
        }
    ],
    async run(client: Client, i: CommandInteraction) {
        interaction=i
        handler()
    }
};

