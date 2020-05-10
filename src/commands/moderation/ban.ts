import { prefix } from "../../config/config";
import { Message, Client } from "discord.js";
import { Embed } from "../../templates/embed";
import { escapeMarkdown } from '../../modules/escape';


export class Command {

	name: string = "ban";
	aliases: string[] = [];
	description: string = "Bans a user from the server";
	category: string = "moderation";
	usage: string = [
		`${prefix}ban @<user>`,
		`${prefix}ban @<user> <reason>`,
		`${prefix}ban @<user> <reason> <days>`,
		`${prefix}ban <userID>`,
		`${prefix}ban <userID> <reason>`,
		`${prefix}ban <userID> <reason> <days>`,
	].join("\n");

	hidden: boolean = false;

	authorisation: string[] = [
		"mod",
		"admin"
	];

	enabled: boolean = true

	private _client: Client;

	constructor(client: Client) {
		this._client = client;
	}

	async execute(message: Message, cmd: string[]): Promise<void> {

		if(cmd.length == 1) return Embed(message, `Invalid syntax:\n \`${this.usage}\``);
		const id: any = (message.mentions.users.size == 0) ? cmd[1] : message.mentions.users.first()?.id;

		let reason = cmd[2] || `No reason provided.`;
		let days: number = Number(cmd[3]) || 0;

		if (this._client.user) if (id == this._client.user.id) return Embed(message, `Please pick another user to be banned.`);
		if (message.author.id == id) return Embed(message, `You cannot ban your self.`);
		

		const member = await message.guild?.member(id);
		if (!member) return Embed(message, `Sorry we could not find that user.`);

		console.log("Them", member.roles.highest.position, "You", message.member?.roles.highest.position)

		//If the user to be banned has a higher role than the banner prevent it
		if (!message.member) return Embed(message, `Sorry we are having problems finding your user when calculating if you have the permission to ban this user.`);
		if (member.roles.highest.position >= message.member.roles.highest.position) return Embed(message, `Did not ban the user. The user you are trying to ban is either on the same level or higher than you.`);

		if(!member.bannable) return Embed(message, `Sorry i can not ban this user, make sure I have all the permission i need.`);
		member.ban({reason: reason, days: days}).then(() => {
			Embed(message, `The user \`${escapeMarkdown(member.user.username)}\` has been successfully banned.`);
		}).catch( error => {
			console.log(error);
			Embed(message, `The user \`${escapeMarkdown(member.user.username)}\` could not be banned due to an error.`)
		});
	};
}