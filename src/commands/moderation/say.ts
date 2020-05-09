import { prefix } from "../../config/config";
import { Message, Client } from "discord.js";
import { Embed } from "../../templates/embed";

export class Command {

	name: string = "say";
	aliases: string[] = ["repeat"];
	description: string = "Echos the input inside a embed";
	category: string = "moderation";
	usage: string = `${prefix}say Your message goes here`;

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

		Embed(message, cmd.slice(1).join(" "));
		if (message.deletable) message.delete().catch();
	};
}