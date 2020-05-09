import { Client, Message, Collection } from "discord.js";
import { Handlers } from "../loader";
import { prefix, masters } from "../config/config";
import { Unauthorised } from "../templates/unauthorised";
import { Embed } from "../templates/embed";
import { getGroups } from "../modules/auth";
import { Command } from "../commands/help";
import { CommandCollection, getCommands, clearCommands, setCommands } from "../modules/collections";

export class Handler {
	name: string = "message handler";
	event: string = "message";

	enabled: boolean = true

	commands: Collection<string, Command>

	constructor(client: Client) {
		let handlers = new Handlers();
		this.commands = handlers.loadCommands(client);

		clearCommands();
		setCommands(this.commands);
	}

	execute = (client: Client): void => {

		client.on("message", async (message: Message) => {

			if (message.author.bot == true) return;
			if (!message.content.startsWith(prefix)) return;

			let cmd = message.content.substr(prefix.length).split(" ");
			cmd[0] = cmd[0].toLocaleLowerCase();

			let command = this.commands.get(cmd[0]) || this.commands.find(c => c.aliases && c.aliases.includes(cmd[0]))
			if (!command) {
				return Embed(message, "That command does not exist.");
			}

			let groups = getGroups(message);
			let authorised: boolean = false;

			command.authorisation.forEach( (group) => {
				if (groups.includes(group)) authorised = true;
			});

			if (!authorised) return Unauthorised(message, "You lack the authorisation to execute that command in the current channel.");

			try {
				command.execute(message, cmd);
			} catch (error) {
				Embed(message, "Sorry something went wrong.");
			}

		});
	};
}
