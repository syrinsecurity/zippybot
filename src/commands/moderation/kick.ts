import { prefix } from "../../config/config";
import { Message, Client } from "discord.js";
import { Embed } from "../../templates/embed";
import { escapeMarkdown } from '../../modules/escape';


export class Command {

	name: string = "kick";
	aliases: string[] = [];
	description: string = "Kicks a user from the server";
	category: string = "moderation";
	usage: string = [
		`${prefix}kick @<user>`,
		`${prefix}kick @<user> <reason>`,
		`${prefix}kick <userID>`,
		`${prefix}kick <userID> <reason>`
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

		if (this._client.user) if (id == this._client.user.id) return Embed(message, `Please pick another user to kick.`);
		if (message.author.id == id) return Embed(message, `You cannot kick your self.`);
		

		const member = await message.guild?.member(id);
		if (!member) return Embed(message, `Sorry we could not find that user.`);


		//If the user to be kicked has a higher role than the kicker prevent it
		if (!message.member) return Embed(message, `Sorry we are having problems finding your user when calculating if you have the permission to kick this user.`);
		if (member.roles.highest.position >= message.member.roles.highest.position) return Embed(message, `Did not kick the user. The user you are trying to kick is either on the same level or higher than you.`);

		if(!member.kickable) return Embed(message, `Sorry i can not ban this user, make sure I have all the permission i need.`);
		member.kick(reason).then(() => {
			Embed(message, `The user \`${escapeMarkdown(member.user.username)}\` has been successfully kicked.`);
		}).catch( error => {
			console.log(error);
			Embed(message, `The user \`${escapeMarkdown(member.user.username)}\` could not be kicked due to an error.`)
		});
	};
}