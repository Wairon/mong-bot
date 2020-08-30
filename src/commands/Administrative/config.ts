import { MessageEmbed, TextChannel, Role } from 'discord.js';
import { Command, CommandStore, KlasaMessage } from 'klasa';

export default class extends Command {
	constructor(store: CommandStore, file: string[], dir: string) {
		super(store, file, dir, {
			subcommands: true,
			enabled: true,

			runIn: [ 'text' ],
			requiredPermissions: [],
			guarded: true,
			description: 'Configura tu servidoro.',
			extendedHelp: '!config <set/delete> <categoría> <parametro> <valor>',
			quotedStringSupport: false,
			usage: '[set|reset] [category:string] [parameter:string] [value:role|value:channel|value:message|value:boolean|value:string]',
			usageDelim: ' ',
		});
	}

	async run(message: KlasaMessage) {
		if(!message.member.hasPermission('MANAGE_GUILD') && !message.member.roles.cache.has(message.guild.settings.get('roles.owner'))) return message.send('🚫 No tienes permisos para usar este comando.');

		const embed = new MessageEmbed()
		.setColor(message.guild.me.displayColor || 'RED')
		.setTitle('Categorías de configuración')
		.setDescription(`Uso: \`${this.extendedHelp}\`\nEjemplo: \`!config set roles muted @tagrol\``)
		.addFields(
			{ name: 'Roles', value: '`muted`, `member`, `moderator`, `admin`, `owner`, `nofilter`', inline: true },
			{ name: 'Channels', value: '`logs`, `bots`, `welcomes`', inline: true },
			{ name: 'Settings', value: '`filter`, `leveling`, `strictfilter`, `ip`, `verification`', inline: true },
			{ name: 'Filter', value: '`names`, `words`, `invites`, `nudity`', inline: true }
		)
		return await message.send(embed);
	}

	async set(message: KlasaMessage, [category, parameter, value]: [string, string, Role | TextChannel | boolean | string | KlasaMessage]) {
		if(!message.member.hasPermission('MANAGE_GUILD')) return message.send('🚫 No tienes permisos para usar este comando.');

		if(!(category || parameter || value) || (category.toLowerCase() === "channels" && !(value instanceof TextChannel)) || (category.toLowerCase() === "roles" && !(value instanceof Role))) {
			const embed = new MessageEmbed()
			.setColor(message.guild.me.displayColor || 'RED')
			.setTitle('Categorías de configuración')
			.setDescription(`Uso: \`${this.extendedHelp}\`\nEjemplo: \`!config set roles muted @tagrol\``)
			.addFields(
				{ name: 'Roles', value: '`muted`, `member`, `moderator`, `admin`, `owner`, `nofilter`', inline: true },
				{ name: 'Channels', value: '`logs`, `bots`, `welcomes`', inline: true },
				{ name: 'Settings', value: '`filter`, `leveling`, `strictfilter`, `ip`, `verification`', inline: true },
				{ name: 'Filter', value: '`names`, `words`, `invites`, `nudity`', inline: true }
			)
			return await message.send(embed);
		}

		switch(category.toLowerCase()) {
			case "roles":
				switch(parameter) {
					case "muted":
					case "member":
					case "moderator":
					case "admin":
					case "owner": 
					case "nofilter":
						if(value instanceof Role && !value.id) return message.send('🚫 Rol inválido pasado como valor.');
					break;
					default: return message.send('🚫 Rol inválido pasado como valor.'); break;
				}
			break;
			case "channels":
				switch(parameter) {
					case "logs":
					case "bots":
					case "welcomes": 
						if(value instanceof TextChannel && !value.id) return message.send('🚫 Canal inválido pasado como valor.');
					break;
					default: return message.send('🚫 Canal inválido pasado como parametro.'); break;
				}
			break;
			case "settings":
				switch(parameter) {
					case "filter":
					case "leveling":
					case "strictfilter":
						if(typeof value !== "boolean") return message.send('🚫 Opción inválida pasada como valor.'); break;
					case "ip":
						if(typeof value !== "string") return message.send('🚫 Opción inválida pasada como valor.'); break;
					case "verification":
						if(value instanceof KlasaMessage && !value.id) return message.send('🚫 Mensaje inválido pasado como valor.'); break;
					default: return message.send('🚫 Opción inválida pasada como parametro.');
				}
			break;
			case "filter":
				switch(parameter) {
					case "names":
					case "words":
					case "invites":
					case "nudity":
						if(typeof value !== "boolean") return message.send('🚫 Filtro inválido pasado como valor.');
					break;
					default: return message.send('🚫 Filtro inválido pasado como parametro.'); break;
				}
			break;
			default: return message.send('🚫 Categoría inválida pasada como categoría.'); break;
		}

		if((category.toLowerCase() === "roles" && value instanceof Role) || (category.toLowerCase() === "settings" && value instanceof KlasaMessage)) {
			await message.guild.settings.update(`${category}.${parameter}`, value.id);
		} else await message.guild.settings.update(`${category}.${parameter}`, value);
		return message.send('✅ Valor establecido.');
	}

	async reset(message: KlasaMessage, [category, parameter]: [string, string]) {
		if(!message.member.hasPermission('MANAGE_GUILD')) return message.send('🚫 No tienes permisos para usar este comando.');

		if(!(category || parameter)) {
			const embed = new MessageEmbed()
			.setColor(message.guild.me.displayColor || 'RED')
			.setTitle('Categorías de configuración')
			.setDescription(`Uso: \`${this.extendedHelp}\`\nEjemplo: \`!config set roles muted @tagrol\``)
			.addFields(
				{ name: 'Roles', value: '`muted`, `member`, `moderator`, `admin`, `owner`, `nofilter`', inline: true },
				{ name: 'Channels', value: '`logs`, `bots`, `welcomes`', inline: true },
				{ name: 'Settings', value: '`filter`, `leveling`, `strictfilter`, `ip`, `verification`', inline: true },
				{ name: 'Filter', value: '`names`, `words`, `invites`, `nudity`', inline: true }
			)
			return await message.send(embed);
		}

		switch(category.toLowerCase())
		{
			case "roles":
				switch(parameter) {
					case "muted":
					case "member":
					case "moderator":
					case "admin":
					case "owner": 
					case "nofilter":
						await message.guild.settings.reset(`${category.toLowerCase()}.${parameter}`);
						return message.send('✅ Valor reestablecido a valores por defecto.');
					break;
					default: return message.send('🚫 Parametro inválido.'); break;
				}
			break;
			case "channels":
				switch(parameter) {
					case "logs":
					case "bots":
					case "welcomes": 
						await message.guild.settings.reset(`${category.toLowerCase()}.${parameter}`);
						return message.send('✅ Valor reestablecido a valores por defecto.');
					break;
					default: return message.send('🚫 Parametro inválido.'); break;
				}
			break;
			case "settings":
				switch(parameter) {
					case "filter":
					case "leveling":
					case "strictfilter":
					case "ip":
					case "verification":
						await message.guild.settings.reset(`${category.toLowerCase()}.${parameter}`);
						return message.send('✅ Valor reestablecido a valores por defecto.');
					break;
					default: return message.send('🚫 Opción inválida pasada como parametro.');
				}
			break;
			case "filter":
				switch(parameter) {
					case "names":
					case "words":
					case "invites":
					case "nudity":
						await message.guild.settings.reset(`${category.toLowerCase()}.${parameter}`);
						return message.send('✅ Valor reestablecido a valores por defecto.');
					break;
					default: return message.send('🚫 Filtro inválido pasado como parametro.'); break;
				}
			break;
			default: return message.send('🚫 Categoría inválida pasada como valor.'); break;
		}
	}
}