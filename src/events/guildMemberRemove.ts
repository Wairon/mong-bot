import { GuildMember, TextChannel, MessageEmbed } from 'discord.js';
import { Event, EventStore } from 'klasa';

export default class extends Event {
	constructor(store: EventStore, file: string[], dir: string) {
		super(store, file, dir, {
			event :'guildMemberRemove',
			enabled: true,
			once: false
		});
	}

	async run(member: GuildMember) {
		const welcomes = this.client.channels.cache.get(member.guild.settings.get('channels.welcomes')) as TextChannel;

		if(!welcomes) return;

		const embed = new MessageEmbed()
		.setColor('RED')
		.setAuthor(`${member.user.tag} salio del servidor.`, member.user.avatarURL({ format: 'png', dynamic: true }))
		return await welcomes.send(embed);
	}
}