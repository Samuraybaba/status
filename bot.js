require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client({
    intents: [
        "GUILDS", 
        "GUILD_MEMBERS", 
        "GUILD_PRESENCES"
    ]
});

const TOKEN = process.env.BOT_TOKEN; // Bot tokenini .env dosyasından çeker
const GUILD_ID = process.env.GUILD_ID; // Sunucu ID'sini .env'den çeker
const ROLE_ID = process.env.ROLE_ID; // Verilecek rol ID'sini .env'den çeker
const TARGET_TEXT = 'discord.gg/hileler';

client.once('ready', () => {
    console.log(`${client.user.tag} aktif!`);
});

client.on('presenceUpdate', async (oldPresence, newPresence) => {
    if (!newPresence || !newPresence.member) return;
    const member = newPresence.member;
    const guild = client.guilds.cache.get(GUILD_ID);
    if (!guild) return;

    const role = guild.roles.cache.get(ROLE_ID);
    if (!role) return console.log('Rol bulunamadı!');

    const hasTargetText = newPresence.activities && newPresence.activities.some(activity => 
        activity.state && activity.state.includes(TARGET_TEXT)
    );

    if (hasTargetText) {
        if (!member.roles.cache.has(ROLE_ID)) {
            await member.roles.add(ROLE_ID).catch(console.error);
            console.log(`${member.user.tag} kullanıcısına rol verildi.`);
        }
    } else {
        if (member.roles.cache.has(ROLE_ID)) {
            await member.roles.remove(ROLE_ID).catch(console.error);
            console.log(`${member.user.tag} kullanıcısından rol alındı.`);
        }
    }
});

client.login(TOKEN);