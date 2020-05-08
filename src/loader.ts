import { Client } from "discord.js"
import fs from 'fs';
import { Handler } from "./handlers/message";

export class Handlers {

	loaded: string[];

	loadAll = loadHandlers;}

function loadHandlers(client: Client): void {
	var handlerFiles = fs.readdirSync(`./handlers`).filter(file => file.endsWith('.js'));

	//Loads all general commands.
	for (let file of handlerFiles) {
		delete require.cache[require.resolve(`./handlers/${file}`)];
		var handlerModule = require(`./handlers/${file}`);
		let handler: Handler = new handlerModule.Handler();

		if (handler.enabled == false) continue;
		
		handler.execute(client);
	}
}