import { MessageEmbed, TextChannel } from 'discord.js';
import { Command, CommandStore, KlasaMessage } from 'klasa';
import { CommandArguments, hasRoles } from '../../client/utils';

const forbidden = ['@everyone', '@here', '\@everyone', '\@here'];

export default class extends Command {
	constructor(store: CommandStore, file: string[], dir: string) {
		super(store, file, dir, {
			subcommands: true,
			enabled: true,
			runIn: [ 'text' ],
			requiredPermissions: [],
			guarded: true,
			description: 'Agrega un comando del servidor.',
			extendedHelp: '!addCmd <add|remove> <nombre> [contenido]',
			quotedStringSupport: true,
			usage: '[add|remove] [name:string] [content:...string]',
			usageDelim: ' ',
		});
	}

	async run(message: KlasaMessage) {
		if(!hasRoles(message.member)) return;

		const embed = new MessageEmbed()
		.setTitle('Uso del comando')
		.setColor('RED')
		.setDescription('Usa este comando con ' + this.extendedHelp)
		return await message.send(embed);
	}

	async remove(message: KlasaMessage, [name]: [string]) {
		if(!hasRoles(message.member)) return;

		const availableCommands = message.guild.settings.get('settings.commands') as Array<CommandArguments>;
		if(availableCommands) {
			availableCommands.forEach(async (cmd) => {
				if(cmd.name === name) {
					await message.guild.settings.update('settings.commands', cmd, { action: 'remove' });
					await message.send('✅ Comando eliminado.');

					const logs = this.client.channels.cache.get(message.guild.settings.get('channels.lgos')) as TextChannel;

					if(logs) {
						const embed = new MessageEmbed()
						.setTitle('Comando eliminado')
						.setColor('GREEN')
						.setAuthor(`Emitido por ${message.author.tag}`)
						.addField('Nombre', name, true)
						.setTimestamp();
						logs.send(embed);
					}

					return;
				}
			});

			return message.send('🚫 No se pudo encontrar un comando con ese nombre.');

		} else return message.send('🚫 No hay comandos!');
	}

	async add(message: KlasaMessage, [name, content]: [string, string]) {
		if(!hasRoles(message.member)) return;

		if(!name || !content) return message.send('🚫 Este comando requiere de un **nombre** y **contenido**.');
		if(forbidden.includes(name) || forbidden.includes(content) || content.includes("<&@") || content.includes("<@")) return message.send('Chupala master');

		const availableCommands = message.guild.settings.get('settings.commands') as Array<CommandArguments>;
		if(availableCommands) {
			availableCommands.forEach((cmd) => {
				if(cmd.name === name) return message.send('🚫 Ya hay un comando con este nombre.');
			});
		}

		const command:CommandArguments = {
			name: name,
			content: content
		};

		await message.guild.settings.update('settings.commands', command, { action: 'add' });
		message.send('✅ Comando añadido.');

		const logs = this.client.channels.cache.get(message.guild.settings.get('channels.lgos')) as TextChannel;
		if(logs) {
			const embed = new MessageEmbed()
			.setTitle('Comando añadido')
			.setColor('GREEN')
			.setAuthor(`Emitido por ${message.author.tag}`)
			.addField('Nombre', name, true)
			.addField('Contenido', content, true)
			.setTimestamp();
			logs.send(embed);
		}

		return;
	}

	getCommandFromName(object: Array<CommandArguments>, name: string):CommandArguments {
		object.forEach((cmd) => {
			if(cmd.name === name) return cmd;
		});

		return null;
	}
}