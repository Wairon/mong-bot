import { TextChannel, MessageEmbed } from 'discord.js';
import { Event, EventStore, KlasaMessage } from 'klasa';
import * as Filter from '../client/filter';

export default class extends Event {
	constructor(store: EventStore, file: string[], dir: string) {
		super(store, file, dir, {
			enabled: true,
			once: false,
			event: 'messageUpdate'
		});
	}

	async run(oldMessage: KlasaMessage, newMessage: KlasaMessage) {
		if(!(oldMessage.content || newMessage.content)) return;
		if(oldMessage.content === newMessage.content) return;

		const logs = this.client.channels.cache.get(newMessage.guild.settings.get('channels.logs')) as TextChannel;

		if(newMessage.guild.settings.get('settings.filter') && !newMessage.member.roles.cache.has(newMessage.guild.settings.get('roles.nofilter'))) {
			if(newMessage.guild.settings.get('filter.invites')) {
				if(newMessage.content.includes('discord.gg/') || newMessage.content.includes('discordapp.com/invite/')) {
					await newMessage.delete();
					newMessage.send(`**¡Mensaje eliminado!** ${newMessage.author} tu mensaje fue eliminado porque contenía una invitación.`).then((m) => m.delete({ timeout: 5000 }));
					await newMessage.author.settings.update('warns', newMessage.author.settings.get('warns') + 1);
					if(logs) {
						const error = new MessageEmbed()
						.setColor('RED')
						.setAuthor(`Advertencia sobre ${newMessage.author.tag}`, newMessage.author.avatarURL({ format: 'png', dynamic: true }))
						.setTitle('Mensaje editado con invitación')
						.setDescription(`Canal ${newMessage.channel}`)
						.addField('Contenido', newMessage.content, true)
						.setFooter(`ID: ${newMessage.author.id}`)
						.setTimestamp();
						logs.send(error);
					}
				}
			}

			if(newMessage.guild.settings.get('filter.words')) {
				if(Filter.Keywords.some(word => newMessage.content.toLowerCase().includes(word))) {
					await newMessage.delete();
					newMessage.send(`**¡Mensaje eliminado!** ${newMessage.author} tu mensaje fue eliminado porque contenía una palabra filtrada.`).then((m) => m.delete({ timeout: 5000 }));
					await newMessage.author.settings.update('warns', newMessage.author.settings.get('warns') + 1);
					if(logs) {
						const error = new MessageEmbed()
						.setColor('RED')
						.setAuthor(`Advertencia sobre ${newMessage.author.tag}`, newMessage.author.avatarURL({ format: 'png', dynamic: true }))
						.setTitle('Mensaje editado con palabra filtrada')
						.setDescription(`Canal ${newMessage.channel}`)
						.addField('Contenido', newMessage.content, true)
						.setFooter(`ID: ${newMessage.author.id}`)
						.setTimestamp();
						logs.send(error);
					}
				}
			}
		}

		if(logs) {
			const embed = new MessageEmbed()
			.setColor('BLUE')
			.setAuthor(`${newMessage.author.tag}`, newMessage.author.avatarURL({ format: 'png', dynamic: true }))
			.setTitle('Mensaje editado')
			.setDescription(`Canal ${newMessage.channel}`)
			.addFields(
				{ name: 'Anterior mensaje', value: oldMessage.content, inline: true },
				{ name: 'Nuevo mensaje', value: newMessage.content, inline: true }
			)
			.setFooter(`ID: ${newMessage.author.id}`)
			.setTimestamp();
			await logs.send(embed);
		}
	}
}