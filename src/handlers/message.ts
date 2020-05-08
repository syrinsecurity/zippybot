import { Client, Message } from "discord.js";
import { Handlers } from "../loader";
import { prefix, masters } from "../config";
import { Unauthorised } from "../templates/unauthorised";
import { Embed } from "../templates/embed";

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

			
			command.execute(message, cmd);
		});
	};
}
