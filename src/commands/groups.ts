import { prefix } from "../config/config";
import { Message, Client } from "discord.js";
import { Embed } from "../templates/embed";
import { getGroups } from '../modules/auth';

export class Command {

	name: string = "groups";
	aliases: string[] = [];
	description: string = "Lists all the groups you are in";
	category: string = "maintenance";
	usage: string = `${prefix}groups`
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
		Embed(message, getGroups(message).join(", "));
	};
}