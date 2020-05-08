import { prefix } from "../config";
import { Message } from "discord.js";

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

	execute(message: Message, cmd: string[]): void {
		
	};
}