import { User, Message } from "discord.js";
import { masters, roleBasedAuth } from "../config";



export function getGroups(message: Message): string[] {
	let groups = [];
	
	if (message.author.bot == true) groups.push("bot");
	if (masters.includes(message.author.id)) groups.push("root");

	if (message.channel.type == "dm") return [...groups, "user"];
	groups.push("member");

	if (roleBasedAuth) {
		//Role based group assignment
		let roles = message.member.roles.cache;
		if (roles.has("708386103618437200")) groups.push("mod"); //TODO: update hard coded ids to db
		if (roles.has("708324993116667926")) groups.push("admin");
	} else {
		//Perms based group assignment
		let perms = message.member.permissions;
		if(perms.has("KICK_MEMBERS")) groups.push("mod");
		if(perms.has("ADMINISTRATOR")) groups.push("admin");
		if(message.guild.ownerID == message.author.id) groups.push("owner");
	}
	
	return groups;
}