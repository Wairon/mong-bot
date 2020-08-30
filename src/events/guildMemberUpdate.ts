import { GuildMember, TextChannel, MessageEmbed } from 'discord.js';
import { Event, EventStore } from 'klasa';
import * as Filter from '../client/filter';

export default class extends Event {
	constructor(store: EventStore, file: string[], dir: string) {
		super(store, file, dir, {
			enabled: true,
			once: false
		});
	}

	async run(oldMember: GuildMember, newMember: GuildMember) {
		if(!(oldMember || newMember)) return;

		const logs = this.client.channels.cache.get(newMember.guild.settings.get('channels.logs')) as TextChannel;

		if(oldMember.displayName != newMember.displayName || oldMember.nickname != newMember.nickname) {
			if(newMember.guild.settings.get('settings.filter') && newMember.guild.settings.get('filter.names') && !newMember.roles.cache.has(newMember.guild.settings.get('roles.nofilter'))) {
				if(Filter.Keywords.some(word => newMember.displayName.toLowerCase().includes(word))) {
					if(newMember.guild.ownerID === newMember.user.id) return; // Evitar errores de la API

					await newMember.setNickname('[Nombre filtrado]', 'Filtro para nombres');
					if(logs) {
						const error = new MessageEmbed()
						.setColor('RED')
						.setAuthor(`Advertencia sobre ${newMember.user.tag}`, newMember.user.avatarURL({ format: 'png', dynamic: true }))
						.setTitle('Sobrenombre filtrado')
						.setFooter(`ID: ${newMember.user.id}`)
						.setTimestamp();
						logs.send(error);
					}
				}
			}

			if(logs) {
				const embed = new MessageEmbed()
				.setColor('BLUE')
				.setTitle(`${oldMember.user.tag} cambió su sobrenombre`)
				.addFields(
					{ name: 'Antiguo nombre', value: oldMember.displayName, inline: true },
					{ name: 'Nuevo nombre', value: newMember.displayName, inline: true }
				)
				.setFooter(`ID: ${newMember.user.id}`)
				.setTimestamp();
				logs.send(embed);
			}
		}

		if(logs) {
			if(oldMember.roles.cache.size != newMember.roles.cache.size) {
				const newRole = newMember.roles.cache.difference(oldMember.roles.cache);

				newRole.delete(newMember.guild.settings.get('roles.member'));
				if(newRole.size < 1) return;

				const embed = new MessageEmbed();
				if(newMember.roles.cache.size > oldMember.roles.cache.size) {
					embed.setTitle('Rol añadido');
					embed.setColor('GREEN');
				} else {
					embed.setTitle('Rol eliminado');
					embed.setColor('RED');
				}
				embed.addFields(
					{ name: 'Usuario', value: `${oldMember.user.tag}`, inline: true },
					{ name: 'Rol', value: newRole.map((role) => role.name), inline: true }
				);
				embed.setFooter(`ID: ${newMember.user.id}`);
				embed.setTimestamp();
				logs.send(embed);
			}
		}
	}
}