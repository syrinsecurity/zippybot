import { prefix } from "../../config/config";
import { Message, Client } from "discord.js";
import { Embed } from "../../templates/embed";

export class Command {

	name: string = "purge";
	aliases: string[] = ["delete", "erase"];
	description: string = "Deletes x amount of messages";
	category: string = "moderation";
	usage: string = `${prefix}purge <amount>`;

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

		const amount: number = Number(cmd[1]);

		if(isNaN(amount) || amount == 0) return Embed(message, `Invalid syntax:\n${this.usage}`);
		if(amount > 100 || amount < 2) return Embed(message, `Please only specify a number between 2 and 100`);

		message.channel.bulkDelete(amount, true).catch( (error) => {
			console.log(error);
		});
	};
}