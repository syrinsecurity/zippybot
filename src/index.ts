import { Client, Collection } from 'discord.js';
import { token, prefix, masters} from "./config";
import { Handlers } from './loader';

var client: Client = new Client();

var handlers = new Handlers();

handlers.loadAll(client);

client.on("ready", () => {
	console.log(`Client [ONLINE]`);
});


client.login(token);