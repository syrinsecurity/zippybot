import { prefix } from "../../config/config";
import { Message, Client } from "discord.js";
import { Embed } from "../../templates/embed";
import { db } from '../../handlers/mysql';
import { escapeMarkdown } from '../../modules/escape';


export class Command {

	name: string = "logs";
	aliases: string[] = [];
	description: string = "Retrieves a message via the ID form the database";
	category: string = "moderation";
	usage: string = `${prefix}logs <messageID>`;

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
		const id = cmd[1];

		db.query("SELECT `username`, `userID`, `content`, `created` FROM `messages` WHERE `id` = ? AND `guild` = ?", [id, message.guild?.id], (err, result) => {
			if(err) {
				console.log(err)
				return Embed(message, "Sorry we could not find that.")
			};

			if (result.size == 0 || result[0] == undefined) return Embed(message, "Message not found.");
			
			if(result[0]) {
				Embed(message, `Username: ${result[0].username}
UserID: ${result[0].userID}
Content:\`\`\`
${escapeMarkdown(result[0].content)}
\`\`\`
				`)
			}
		});

		
	};
}