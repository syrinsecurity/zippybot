import { prefix } from "../config";
import { Message, Client } from "discord.js";
import { Embed } from "../templates/embed";

export class Command {

	name: string = "help";
	aliases: string[] = ["h", "?"];
	description: string = "List all available commands";
	category: string = "general";
	usage: string = `${prefix}help`
	hidden: boolean = false;

	authorisation: string[] = [
		"user",
		"member"
	];

	enabled: boolean = true

	private _client: Client;

	constructor(client: Client) {
		this._client = client;
	}

	async execute(message: Message, cmd: string[]): Promise<void> {
		Embed(message, "Hi");
	};
}
