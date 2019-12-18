const Cal = require("./calendar.js");
const Discord = require("discord.js");
const moment = require("moment");
const { prefix } = require("./config.json");
const client = new Discord.Client();

// Command validation and such
function validDate(date) {
  if (moment(date, "YYYY-MM-DD", true).format()) {
    return true;
  } else {
    return false;
  }
}

function validDateTime(dateAndTime) {
  if (moment(dateAndTime, "YYYY-MM-DD hh:mmA").format()) {
    return true;
  } else {
    return false;
  }
}

function setBirthday(message, date) {
  let id = message.member.id;
  let longFormat = moment(date).format("L");
  let bday = longFormat
    .split("/")
    .slice(0, 2)
    .join("/");
  Cal.insertBirthday(id, longFormat);
  directMessage(message.author, `Birthday set to ${bday}`);
}

function handleBdayRequest(message) {
  let id = message.member.id;
  let bday = Cal.getBirthday(id);
  console.log(bday);
  directMessage(message.member, `Your birthday is ${bday}`);
}

async function getUserInput(channel) {
  let filter = () => true;
  let response = await channel.awaitMessages(filter, {
      maxMatches: 1, // you only need one message
      time: 60000 // the time you want it to run for
    }).catch(console.log);
  
  if (response && response.size > 0) {
    return response;    
  }
  
}

async function setGuildEvent(message, commandArr) {
  let askName = await message.author.send(`You are creating a guild event for ${commandArr[2]} @ ${commandArr[3]}.\nWhat would you like to name this event?`);
  let response = await getUserInput(askName.channel);
  let name = response.first().content;
  
  askName.channel.send("Provide a short description of the event.");
  response = await getUserInput(askName.channel);
  let shortDesc = await response.first().content;
  
  askName.channel.send("Provide a longer description of the event.");
  response = await getUserInput(askName.channel);
  let longDesc = await response.first().content;
  
  console.log(`${name}\n${shortDesc}\n${longDesc}`);
  
}

function handleGuildEventRequest(commandArr, message) {
  // todo
}

// discord.js
function directMessage(user, msg) {
  user.send(msg);
}

client.once("ready", () => {
  console.log("Ready!");
  //console.log(client.channels);
  //let chnl = client.channels.get("653676965303287852");
  //chnl.send("!add event 12/14/2019 2:00PM");
});

client.on("message", message => {
  let content = message.content.toLowerCase();

  if (content.startsWith(`${prefix}`)) {
    let command = content.replace(`${prefix}`, "");
    let commandArr = command.split(" ");
    // ex. commandArr = ['show', 'bday'] this needs work!
    // ex2. commandArr = ['show', 'event', 'all'] this needs work too!
    // ex3. commandArr = ['add', 'bday', '10/10/1992']
    // ex4. commandArr = ['add', 'event', '10/10/2020', '12:00AM'] need to be able to set time!

    switch (commandArr[0]) {
      case "add":
          if (commandArr[1] == "bday" && commandArr.length == 3) {
            setBirthday(message, commandArr[2]);
          } else if (commandArr[1] == "event" && commandArr.length == 4) {
            setGuildEvent(message, commandArr);
            
            //Cal.insertGuildEvent(message, moment(commandArr[2], moment(commandArr[3]).format("hh:mm A"));
          } else {
            console.log("Wot?");
          }
        break;
      case "show":
        if (commandArr[1] == "bday") {
          handleBdayRequest(message);
        } else if (commandArr[1] == "event") {
          handleGuildEventRequest(commandArr, message);
        }
        break;
      default:
        console.log("Wot?");
    }
  }
});

client.login(process.env.SECRET).catch(console.log);
