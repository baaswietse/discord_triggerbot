require('dotenv').config()
const Discord = require('discord.js');
const mongoose = require("mongoose");
const Users = require('./models/Users')
const client = new Discord.Client();
const commands  = require('./commands')

mongoose.connect('mongodb://baaswietse:W942018d@ds127604.mlab.com:27604/triggerbot', {useNewUrlParser: true, useUnifiedTopology: true });
const connection = mongoose.connection;
connection.once("open", function() {
  console.log("MongoDB database connection established successfully");
});

client.once('ready', () => {
  console.log('Bot is ready');
});

client.login(process.env.BOT_TOKEN);

client.on('message', async (message) => {
  if(message.author.bot) return;

  //loop over alle commands en invoke elke functies met de message
  for (var key in commands) {
      if (commands.hasOwnProperty(key)) {
          console.log(key + " -> " + commands[key]);
          commands[key](message)
      }
  }
});