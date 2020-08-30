import { TextChannel, MessageEmbed } from 'discord.js';
import { Event, EventStore, KlasaMessage } from 'klasa';

export default class extends Event {
	constructor(store: EventStore, file: string[], dir: string) {
		super(store, file, dir, {
			enabled: true,
			once: false,
			event: 'messageDelete'
		});
	}

	async run(message: KlasaMessage) {
		if(message.author.bot || message.author.settings.get('muted')) return;
		const logs = this.client.channels.cache.get(message.guild.settings.get('channels.logs')) as TextChannel;
		if(!logs || message.channel === logs) return;

		const embed = new MessageEmbed()
		.setColor('RED')
		.setAuthor(`${message.author.tag}`, message.author.avatarURL({ format: 'png', dynamic: true}))
		.setTitle('Mensaje eliminado')
		.addField('Contenido', !message.content ? 'Imagen o embed' : message.content, true)
		.addField('Canal', message.channel, true)
		.setFooter(`ID: ${message.author.id}`)
		.setTimestamp();
		await logs.send(embed);
	}
}