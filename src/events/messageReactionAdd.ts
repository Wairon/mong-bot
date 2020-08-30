import { TextChannel, MessageEmbed, MessageReaction } from 'discord.js';
import { Event, EventStore, KlasaUser } from 'klasa';

export default class extends Event {
	constructor(store: EventStore, file: string[], dir: string) {
		super(store, file, dir, {
			enabled: true,
			once: false,
			event: 'messageReactionAdd'
		});
	}

	async run(reaction: MessageReaction, user: KlasaUser) {
		if(reaction.partial) await reaction.fetch();

		if(!reaction.message.guild.settings.get('settings.verification')) return;
		const reactMessage = reaction.message.guild.settings.get('settings.verification');
		if(reaction.message.id !== reactMessage) return;
		if(reaction.emoji.name !== '✅') return;
		const member = reaction.message.guild.member(user);
		if(!member) return;

		await member.roles.add(reaction.message.guild.settings.get('roles.member'));
		
		const logs = this.client.channels.cache.get(reaction.message.guild.settings.get('channels.logs')) as TextChannel;
		if(logs) {
			const embed = new MessageEmbed()
			.setColor('GREEN')
			.setTitle('Usuario verificado')
			.setDescription('El usuario ' + user.tag + ' fue verificado con éxito.');
			logs.send(embed);
		}

		return;
	}
}