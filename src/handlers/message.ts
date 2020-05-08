import { Client, Message } from "discord.js";
import { Handlers } from "../loader";
import { prefix, masters } from "../config";
import { Unauthorised } from "../templates/unauthorised";
import { Embed } from "../templates/embed";
import { getGroups } from "../modules/auth";

export class Handler {
	name: string = "message handler";
	event: string = "onMessage";

	enabled: boolean = true

	execute = (client: Client): void => {

		let handlers = new Handlers();
		let commands = handlers.loadCommands(client);

		client.on("message", async (message: Message) => {

			if (message.author.bot == true) return;
			if (!message.content.startsWith(prefix)) return;

			let cmd = message.content.substr(prefix.length).split(" ");
			cmd[0] = cmd[0].toLocaleLowerCase();

			let command = commands.get(cmd[0]) || commands.find(c => c.aliases && c.aliases.includes(cmd[0]))
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
