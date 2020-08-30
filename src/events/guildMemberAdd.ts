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

	async run(member: GuildMember) {
		const logs = this.client.channels.cache.get(member.guild.settings.get('channels.logs')) as TextChannel;
		const welcomes = this.client.channels.cache.get(member.guild.settings.get('channels.welcomes')) as TextChannel;

		if(member.guild.settings.get('settings.filter')) {
			if(member.guild.settings.get('filter.names')) {
				if(Filter.Keywords.some(word => member.displayName.toLowerCase().includes(word))) {
					if(member.roles.highest.position >= member.guild.me.roles.highest.position) return;

					await member.setNickname('[Nombre filtrado]', 'Filtro para nombres');
					if(logs) {
						const error = new MessageEmbed()
						.setColor('RED')
						.setAuthor(`Advertencia sobre ${member.user.tag}`, member.user.avatarURL({ format: 'png', dynamic: true }))
						.setTitle('Nombre filtrado')
						.addField('Nombre', member.displayName, true)
						.setFooter(`ID: ${member.user.id}`)
						.setTimestamp();
						logs.send(error);
					}
				}
			}
		}
		
		if(member.guild.settings.get('roles.muted')) {
			if(member.user.settings.get('muted')) {
				await member.roles.add(member.guild.settings.get('roles.muted'));
				if(logs) {
					const warning = new MessageEmbed()
					.setColor('RED')
					.setAuthor(`Advertencia sobre ${member.user.tag}`, member.user.avatarURL({ format: 'png', dynamic: true }))
					.setTitle('Evasión de muteo')
					.setFooter(`ID: ${member.user.id}`)
					.setTimestamp();
					logs.send(warning);
				}
			}
		}

		if(welcomes) {
			const embed = new MessageEmbed()
			.setColor('GREEN')
			.setAuthor(`${member.user.tag} entró al servidor.`, member.user.avatarURL({ format: 'png', dynamic: true }))
			welcomes.send(embed);
		}
	}
}