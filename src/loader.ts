import { Client, Collection } from "discord.js"
import fs from 'fs';
import { Handler } from "./handlers/message";
import { Command } from "./commands/help";

export class Handlers {

	loadAll = loadHandlers;

	loadCommands = loadCommands;
}

function loadHandlers(client: Client): void {

	delete require.cache[require.resolve(`./loader.js`)];
	clearModuleCache();
	
	var handlerFiles = fs.readdirSync(`./handlers`).filter(file => file.endsWith('.js'));

	//Loads all handlers
	for (let file of handlerFiles) {
		delete require.cache[require.resolve(`./handlers/${file}`)];
		var handlerModule = require(`./handlers/${file}`);
		let handler: Handler = new handlerModule.Handler(client);

		if (handler.enabled == false) continue;

		handler.execute(client);
	}
}

function loadCommands(client: Client): Collection<string,Command> {
	var commandFiles = fs.readdirSync(`./commands`); 

	var commands: Collection<string,Command> = new Collection();

	//Loads all commands.
	for (let file of commandFiles.filter(file => file.endsWith('.js'))) {
		delete require.cache[require.resolve(`./commands/${file}`)];
		let commandFile = require(`./commands/${file}`);
		let command: Command = new commandFile.Command(client);

		if (command.enabled == false) continue;
		
		commands.set(command.name, command);
	}

	for (let folder of commandFiles.filter(file => file.endsWith('.js') == false)) {
		
		var commandFolderFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js')); 
		for (let file of commandFolderFiles) {
			delete require.cache[require.resolve(`./commands/${folder}/${file}`)];
			let commandFile = require(`./commands/${folder}/${file}`);
			let command: Command = new commandFile.Command(client);
	
			if (command.enabled == false) continue;
			
			commands.set(command.name, command);
		}
	}

	return commands;
}

function clearModuleCache(): void {

	var modules = fs.readdirSync(`./modules`).filter(file => file.endsWith('.js'));

	//Loads all handlers
	for (let file of modules) {
		delete require.cache[require.resolve(`./modules/${file}`)];
	}
}