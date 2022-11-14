import ready from "./listeners/ready";
import interactionCreate from "./listeners/interactionCreate";

// Require the necessary discord.js classes
const { Client, GatewayIntentBits } = require('discord.js');
const { token }  = require("../config.json")

// Create a new client instance
const client = new Client({ 
    intents: [GatewayIntentBits.Guilds] 
});

// Log in to Discord with your client's token
ready(client);
interactionCreate(client);

client.login(token);