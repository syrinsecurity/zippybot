import { Message, MessageEmbed } from "discord.js";
import { theme } from "../config";

export function Unauthorised(message: Message, note: string = "") {

	let embed = new MessageEmbed()
	.setColor(theme.colour)
	.setDescription('You lack the authorisation to execute that command.' || note)
	.setTimestamp()
	.setFooter(theme.footer, theme.icon);

	message.channel.send(embed).catch();

}