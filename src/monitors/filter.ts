import { KlasaMessage, Monitor, MonitorStore } from 'klasa';
import { MessageEmbed, TextChannel } from 'discord.js';
import * as Filter from '../client/filter';

export default class extends Monitor {
	constructor(store: MonitorStore, file: string[], dir: string) {
		super(store, file, dir, {
			enabled: true,
			ignoreBots: true,
			ignoreSelf: true,
			ignoreOthers: false,
			ignoreWebhooks: true,
			ignoreEdits: true,
		});
	}

	async run(message: KlasaMessage) {
		if(!message.guild || !message.guild.settings.get('settings.filter')) return;
		if(message.member.roles.cache.has(message.guild.settings.get('roles.nofilter'))) return;
		if(message.author.settings.get('muted')) return;

		const logs = this.client.channels.cache.get(message.guild.settings.get('channels.logs')) as TextChannel;

		if(message.guild.settings.get('filter.invites')) {
			if(message.content.includes('discord.gg/') || message.content.includes('discordapp.com/invite/')) {
				await message.delete();
				message.send(`**¡Mensaje eliminado!** ${message.author} tu mensaje fue eliminado porque contenía una invitación.`).then(function(m: KlasaMessage){m.delete({ timeout: 20000 });});
				await message.author.settings.update('warns', message.author.settings.get('warns') + 1);
				if(logs) {
					const error = new MessageEmbed()
					.setColor('RED')
					.setAuthor(`Advertencia sobre ${message.author.tag}`, message.author.avatarURL({ format: 'png', dynamic: true }))
					.setTitle('Invitación publicada')
					.setDescription(`Canal ${message.channel}`)
					.addField('Contenido', message.content, true)
					.setFooter(`ID: ${message.author.id}`)
					.setTimestamp();
					logs.send(error);
				}
			}
		}

		if(message.guild.settings.get('filter.words')) {
				if(Filter.Keywords.some(word => message.content.toLowerCase().includes(word))) {
					await message.delete();
					message.send(`**¡Mensaje eliminado!** ${message.author} tu mensaje fue eliminado porque contenía una palabra filtrada.`).then(function(m: KlasaMessage){m.delete({ timeout: 20000 });});
					await message.author.settings.update('warns', message.author.settings.get('warns') + 1);
					if(logs) {
						const error = new MessageEmbed()
						.setColor('RED')
						.setAuthor(`Advertencia sobre ${message.author.tag}`, message.author.avatarURL({ format: 'png', dynamic: true }))
						.setTitle('Palabra(s) filtrada(s)')
						.addField('Contenido', message.content, true)
						.setFooter(`ID: ${message.author.id}`)
						.setTimestamp();
						logs.send(error);
					}
				}
			}
	}
}