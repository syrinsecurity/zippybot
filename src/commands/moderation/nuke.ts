import { prefix } from "../../config/config";
import { Message, Client, TextChannel, PermissionOverwrites, Webhook, Collection } from "discord.js";
import { Embed } from "../../templates/embed";
import { escapeMarkdown } from "../../modules/escape";

export class Command {

	name: string = "nuke";
	aliases: string[] = [];
	description: string = "Completely erases a whole channel";
	category: string = "moderation";
	usage: string = `${prefix}nuke`;

	hidden: boolean = false;

	authorisation: string[] = [
		"admin"
	];

	enabled: boolean = true

	private _client: Client;

	constructor(client: Client) {
		this._client = client;
	}

	async execute(message: Message, cmd: string[]): Promise<void> {

		if(message.channel.type != "text") return;
		let chan:TextChannel = await message.channel.fetch();

		const webhooks = await chan.fetchWebhooks();
		if(webhooks.size > 0 && message.guild?.channels.cache.size == 1) {
			if (!await this.migrateWebhooks(webhooks, message)) return Embed(message, `Failed to migrate your webhooks, aborted.`);
		}

		message.guild?.channels.create(chan.name, {
			type: "text",
			topic: chan.topic || "",
			position: chan.position,
			permissionOverwrites: chan.permissionOverwrites,
			nsfw: chan.nsfw,
			parent: chan.parentID || "",
			rateLimitPerUser: chan.rateLimitPerUser

		}).then( async (newChannel) => {
			
			let success = true;
			if(webhooks.size > 0) {
				webhooks.forEach( async hook => {
					await hook.edit({channel: newChannel.id}).catch( error => {
						success = false;
						console.log(error);
						Embed(message, `Failed to migrate \`${escapeMarkdown(hook.name)}\` to new channel.`);
					});
				})
			}

			if (success) message.channel.delete();

		}).catch( (error) => {
			console.log(error)
		})

		
	};

	async migrateWebhooks(webhooks: Collection<string,Webhook>, message: Message): Promise<boolean> {

		if(!message.guild) return false;
		let success: boolean = false

		await message.guild.channels.create("tmp-ignore").then( channel => {
				
			webhooks.forEach( async (hook) => {
				await hook.edit({channel: channel.id}).catch( (error) => {
					console.log(error);
					return false;
				});
			});

			success = true;

		}).catch( (error) => {
			console.log(error);
		});

		return success;
	}
}