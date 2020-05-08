import { prefix, masters } from "../config";
import { Message, Client } from "discord.js";
import { Unauthorised } from "../templates/unauthorised";
import { Handlers } from "../loader";
import { Embed } from "../templates/embed";
import { getGroups } from '../modules/auth';

export class Command {

	name: string = "test";
	aliases: string[] = [];
	description: string = "test command";
	category: string = "maintenance";
	usage: string = `${prefix}test`
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
		Embed(message, getGroups(message).join(", "));
	};
}