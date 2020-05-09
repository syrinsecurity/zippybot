import { prefix } from "../config/config";
import { Message, Client } from "discord.js";
import { Embed } from "../templates/embed";
import { Handler } from "../handlers/message";
import { CommandCollection } from "../modules/collections";
import { getGroups } from "../modules/auth";

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

		//Sort A-Z
		let commands = CommandCollection.sort(function(a, b) {
			if (a.category < b.category) return -1;
			if (a.category > b.category) return 1;
			
			return 0;
		});

		let page: string[] = [];
		let currentPage: string = "";
		let currentCategory: string | undefined = commands.first()?.category;

		if (!currentCategory) return Embed(message, "No commands to display.");

		commands.forEach(command => {
			if (command.hidden) return;

			if (currentCategory != command.category) {
				page.push(currentPage)
				currentCategory = command.category;
				currentPage = "";
			}

			let groups = getGroups(message);
			let authorised: boolean = false;

			command.authorisation.forEach( (group) => {
				if (groups.includes(group)) authorised = true;
			});

			if (!authorised) return;

			if (currentPage.length == 0) {
				currentPage = `\n> __${command.category.charAt(0).toUpperCase()}${command.category.slice(1)}__\n`;
			}

			currentPage += `\`${prefix}${command.name}\` | **${command.description}**\n`;
		});

		page.push(currentPage);

		Embed(message, page.join(""));
	};
}
