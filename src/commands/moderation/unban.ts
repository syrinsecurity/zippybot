import { prefix } from "../../config/config";
import { Message, Client } from "discord.js";
import { Embed } from "../../templates/embed";
import { escapeMarkdown } from '../../modules/escape';


export class Command {

	name: string = "unban";
	aliases: string[] = [];
	description: string = "UnBans a user from the server";
	category: string = "moderation";
	usage: string = `${prefix}unban <userID>`;

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

		if (this._client.user) if (id == this._client.user.id) return Embed(message, `You can not unban a bot which is not banned in the first place.`);
		if (message.author.id == id) return Embed(message, `You cannot unban your self.`);

		message.guild?.members.unban(id).then( (user) => {
			Embed(message, `The user \`${escapeMarkdown(user.username)}\` has been unbanned.`);
		}).catch( () => {
			Embed(message, `Sorry, this user could not be unbanned.`);
		});
	};
}