require('dotenv').config();
const Discord = require('discord.js');
const { XMLHttpRequest } = require('xmlhttprequest');
const client = new Discord.Client();
const token = process.env.DISCORDTOKEN;
const url =
  'https://panel.snowbot.eu/api/moderatorCheckerPC/checkModerator.php?gameServer=';
const serverName = 'Ilyzaelle';
let serverNames = [
  'Agride',
  'Brumen',
  'Furye',
  'Ilyzaelle',
  'Julith',
  'Merkator',
  'Mériana',
  'Nidas',
  'Pandore',
  'Ush',
  'Oto Mustam',
  'Ombre',
  'Jahash',
  'Écho',
  'Echo',
];
var channelID = '758132054016655432';

client.login(token);
client.on('ready', () => {
  console.log('bot is ON');
  const channel = client.channels.cache.get(channelID);
  channel.messages.fetch({ limit: 100 }).then((msg) =>
    msg.map((x) => {
      if (x.content.includes('bot is running')) x.delete();
    })
  );
  channel
    .send(':ballot_box_with_check:  **alerte-moderateur bot is running ...**')
    .catch((e) => console.log(e));

  for (let index = 0; index < serverNames.length; index++) {
    const serverName = serverNames[index];
    setInterval(() => {
      checkModerator(url, serverName, channel);
    }, 1000 * 3);
  }
});
//checkModerator(url, serverName);
function checkModerator(url, serverName, channel) {
  const urlGet = url + serverName;
  var xhr = new XMLHttpRequest();
  xhr.open('GET', urlGet);

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        const resLength = xhr.responseText.length;
        const moderateurExist = ' Moderator is online ';
        if (resLength) {
          console.log(
            'server ' + serverName + ' : ',
            resLength ? 'mod online' : 'mod offline'
          );
        }

        if (resLength) {
          //console.log('pssed', passedMessages);

          channel.messages
            .fetch({ limit: 100 })
            .then((msg) => {
              console.log(msg.content);
              let serverMessageAlreadyExist = false;
              return msg.map((x) => {
                if (x.content.includes(serverName)) {
                  console.log(serverMessageAlreadyExist);
                  return (serverMessageAlreadyExist = true);
                }
              })
                ? true
                : false;
            })
            .then((serverMessageAlreadyExist) => {
              console.log(serverMessageAlreadyExist);
              if (!serverMessageAlreadyExist) {
                console.log(
                  'server ' + serverName + ' : ',
                  resLength ? 'mod online' : 'mod offline'
                );
                channel
                  .send(
                    ':ballot_box_with_check:  Checking server ' +
                      serverName +
                      '...' +
                      moderateurExist
                  )
                  //.then((msg) => {msg.delete({ timeout: 6000 });})
                  .catch((e) => console.log(e));
              } else {
                console.log(
                  'server ' + serverName + ' : ',
                  resLength ? 'mod still online' : 'mod offline'
                );
              }
            });
        } else {
          channel.messages.fetch({ limit: 100 }).then((msg) =>
            msg.map((x) => {
              if (x.content.includes(serverName)) x.delete();
            })
          );
        }
      } else {
        console.log('error', xhr.statusText);
      }
    }
  };

  xhr.send();
}
