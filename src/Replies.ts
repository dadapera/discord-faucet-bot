import { CommandInteraction } from "discord.js";

async function successfulMsg(interaction: CommandInteraction, msg:string){
    await interaction.followUp({
        ephemeral: true,
        content: `✅Successful! tx: ${msg}`
    })
}

async function failedMsg(interaction: CommandInteraction){
    await interaction.followUp({
        ephemeral: true,
        content: `❌Something gone wrong! Try later.`
    })
}

async function sendingMsg(interaction: CommandInteraction, network:string, token:string, tokenAmount: string ,userAddress:string){
    await interaction.followUp({
        ephemeral: true,
        content: `💸Sending ${tokenAmount} ${token} on ${network}\nto: ${userAddress}\n...`
    }); 
}

async function waitingMsg(interaction: CommandInteraction){
    await interaction.followUp({
        ephemeral: true,
        content: `⌛Waiting for finalization...`
    }); 
}

async function waitOneDayMsg(interaction: CommandInteraction) {
    await interaction.followUp({
        ephemeral: true,
        content: `⏲Wait 24h before another request.`
    }); 
}

export {successfulMsg, failedMsg, sendingMsg, waitingMsg, waitOneDayMsg}