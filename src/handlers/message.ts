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

		client.on("message", async (message: Message) => {

			if (message.content == `${prefix}reload`) {

				if (masters.includes(message.author.id) == false) {
					return Unauthorised(message);
				}

				client.removeAllListeners();
				let handlers = new Handlers();
				handlers.loadAll(client);

				Embed(message, "All event handlers reloaded.")
			}
		});
	};
}
