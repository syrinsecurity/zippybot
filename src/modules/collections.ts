import { Collection } from "discord.js";
import { Command } from "../commands/help";

export let CommandCollection = new Collection<string,Command>();

export function getCommands(): Collection<string,Command> {
	return CommandCollection;
}

export function setCommand(name: string, command: Command): void {
	CommandCollection.set(name, command);
}

export function setCommands(commands: Collection<string,Command>) {
	CommandCollection = commands;
}

export function clearCommands(): void {
	CommandCollection.clear();
}