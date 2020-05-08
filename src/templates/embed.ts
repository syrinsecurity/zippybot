import { Message, MessageEmbed, EmbedField } from "discord.js";
import { theme } from "../config";

export function Embed(message: Message, note: string = "", fields: EmbedField[] = []) {

	let embed = new MessageEmbed()
	.setColor(theme.colour)
	.setDescription(note)
	.addFields(fields)
	.setTimestamp()
	.setFooter(theme.footer, theme.icon);

	message.channel.send(embed).catch();

}