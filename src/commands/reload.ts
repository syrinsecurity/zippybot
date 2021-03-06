import { prefix, masters } from "../config/config";
import { Message, Client } from "discord.js";
import { Handlers } from "../loader";
import { Embed } from "../templates/embed";

export class Command {

	name: string = "reload";
	aliases: string[] = ["r"];
	description: string = "Reloads all commands and handlers";
	category: string = "maintenance";
	usage: string = `${prefix}reload`
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
		
		this._client.removeAllListeners();
		let handlers = new Handlers();
		handlers.loadAll(this._client);

		Embed(message, "All event handlers reloaded.");

	};
}