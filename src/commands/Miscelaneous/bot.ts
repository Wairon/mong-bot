import { MessageEmbed } from 'discord.js';
import { Command, CommandStore, KlasaMessage } from 'klasa';

export default class extends Command {
	constructor(store: CommandStore, file: string[], dir: string) {
		super(store, file, dir, {
			enabled: true,
			runIn: [ 'text', 'dm' ],
			cooldown: 30,
			cooldownLevel: 'channel',
			requiredPermissions: [],
			guarded: true,
			description: 'Muestra estadísticas del bot.',
			extendedHelp: '!bot',
			quotedStringSupport: false,
			usage: '',
			usageDelim: undefined,
		});
	}

	async run(message: KlasaMessage) {
		const embed = new MessageEmbed()
		.setTitle('Estadísticas del bot')
		.setColor(message.guild.me.displayColor || 'BLUE')
		.setThumbnail(this.client.user.avatarURL({ format: 'png', dynamic: true }))
		.addFields(
			{ name: 'Usuarios', value: this.client.users.cache.size - this.client.guilds.cache.size, inline: true },
			{ name: 'Servidores', value: this.client.guilds.cache.size, inline: true },
			{ name: 'Ping', value: `${this.client.ws.ping}ms`, inline: true }
		);

		return await message.send(embed);
	}
}