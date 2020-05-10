import mysql from 'mysql';
import { mysqlDetails } from '../config/config';
import { Client } from 'discord.js';

export var db = mysql.createConnection({
	host: mysqlDetails.host,
	port: mysqlDetails.port,
	user: mysqlDetails.username,
	password: mysqlDetails.password,
	database: mysqlDetails.dbname
});

db.connect( (err) => {
	if (err) return console.log(err);
});


export class Handler {
	name: string = "mysql handler";
	event: string = "";

	enabled: boolean = true

	constructor(client: Client) {
		
	}

	execute = (client: Client): void => {
		
	}

}