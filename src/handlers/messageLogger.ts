import { Client, Message, Collection } from "discord.js";
import { mysqlDetails } from "../config/config";
import { db } from './mysql';
import { getGroups } from "../modules/auth";


export class Handler {
	name: string = "message logger";
	event: string = "message";

	enabled: boolean = true;

	logBuffer: object[] = [];
	lastInsert: number = 0

	constructor(client: Client) {

	}

	execute = (client: Client): void => {

		client.on("message", async (message: Message) => {
			const timeNow: number = Date.now() / 1000;

			let attachments: object[] = [];

			message.attachments.forEach( attachment => {
				attachments.push({
					id: attachment.id,
					name: attachment.name,
					size: attachment.size,

					height: attachment.height,
					width: attachment.width,

					proxyURL: attachment.proxyURL,
					url: attachment.url
				});
			});

	
			const channelName = (message.channel.type == "text") ? message.channel.name : (message.channel.type == "dm") ? message.channel.recipient.username : message.channel.name
			const guildID = (message.guild) ? message.guild.id : message.channel.id;
			const guildName = (message.guild) ? message.guild.name : "DM";

			const msg = [
				message.id,
				message.content,
				message.author.username,
				message.author.id,
				message.author.discriminator,

				message.attachments.size,
				JSON.stringify(attachments),

				message.mentions.users.size,
				message.mentions.roles.size,

				message.createdTimestamp,
				getGroups(message).includes("mod") ?   1 : 0,
				getGroups(message).includes("admin") ? true : false,
				getGroups(message).includes("staff") ? true : false,
				message.author.bot,

				message.channel.id,
				channelName,
				guildID,
				guildName
			];

			this.logBuffer.push(msg);

			//Checks if 2 seconds has elapsed
			//if(this.lastInsert < timeNow + 5) {
			//if(message.content.includes("#")) {
				this.lastInsert = timeNow;
				const messages = this.logBuffer;
				this.logBuffer = [];

				db.query("INSERT INTO messages (`id`, `content`, `username`, `userID`, `tag`, `attachmentCount`, `attachments`, `mentionUserCount`, `mentionRoleCount`, `created`, `mod`, `admin`, `staff`, `bot`, `channel`, `channelName`, `guild`, `guildName`) VALUES ?", [messages], (err, result) => {
					if (err) return console.log(err);
				});
			//}
		});
	};

	log() {

	}
}
