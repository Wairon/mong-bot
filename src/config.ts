import { KlasaClientOptions } from 'klasa';

export const token = process.env.TOKEN;
export const config: KlasaClientOptions = {
	partials: ['MESSAGE', 'REACTION'],
	preserveSettings: true,
	prefix: '!',
	fetchAllMembers: true,
	messageSweepInterval: 0,
	typing: false,
	commandEditing: false,
	commandLogging: false,
	disabledCorePieces: ['commands'],
	language: 'es-ES',
	createPiecesFolders: false,
	owners: ["710330422147547236"],
	readyMessage: (client) => `[~] Bot iniciado en ${client.guilds.cache.size} servidor(es) con ${client.users.cache.size - client.guilds.cache.size} usuario(s) en total.`
};