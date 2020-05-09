import { User, Message } from "discord.js";
import { masters, roleBasedAuth, authRoles } from "../config/config";



export function getGroups(message: Message): string[] {
	let groups = [];
	
	if (message.author.bot == true) groups.push("bot");
	if (masters.includes(message.author.id)) groups.push("root");

	if (message.channel.type == "dm") return [...groups, "user"];
	groups.push("member");

	//Check if Message.member is NULL
	if (!message.member) return groups;

	if (roleBasedAuth) {
		//Role based group assignment
		let roles = message.member.roles.cache;

		if (roles.has(authRoles.mod)) groups.push("mod");
		if (roles.has(authRoles.admin)) groups.push("admin");
	} else {
		//Perms based group assignment
		let perms = message.member.permissions;
		if(perms.has("BAN_MEMBERS")) groups.push("mod");
		if(perms.has("ADMINISTRATOR")) groups.push("admin");
	}

	//Check if message.guild is NULL
	if(!message.guild) return groups;
	if(message.guild.ownerID == message.author.id) {

		//Auto inherit lower groups
		if(!groups.includes("mod")) groups.push("mod");
		if(!groups.includes("admin")) groups.push("admin")

		groups.push("owner");
	}
	
	return groups;
}