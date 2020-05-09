import { prefix, masters } from "../config/config";
import { Message, Client, MessageAttachment } from "discord.js";
import { Unauthorised } from "../templates/unauthorised";
import { Handlers } from "../loader";
import { Embed } from "../templates/embed";
import { promises } from "dns";

export class Command {

	name: string = "eval";
	aliases: string[] = [];
	description: string = "Eval commands";
	category: string = "maintenance";
	usage: string = `${prefix}eval`
	hidden: boolean = false;

	authorisation: string[] = [
		"root"
	];

	enabled: boolean = true

	private _client: Client;

	constructor(client: Client) {
		this._client = client;
	}

	async execute(message: Message, cmd: string[]): Promise<void> {

		try {
			let result = eval(message.content.slice(prefix.length+this.name.length+1));
			if (String(result).length == 0 || !result) {
				result = "*No return value.*";
			}

			if (String(result).length >= 2000) {
				const attachment = new MessageAttachment(result, 'result.txt');

				message.author.send(`Here is the output to your command in: \`${message.guild?.name}#${message.channel.id}\``, attachment).then( () => {
					Embed(message, `The output to that command was too big, check your dms for a attachment containing the output.`);
				});
			}

			Embed(message, result);
		} catch (error) {
			Embed(message, `**ERROR**\n${error}`);
		}
	};
}