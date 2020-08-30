import { GuildMember, MessageEmbed } from 'discord.js';
import { Command, CommandStore, KlasaMessage, KlasaUser } from 'klasa';

export default class extends Command {
	constructor(store: CommandStore, file: string[], dir: string) {
		super(store, file, dir, {
			enabled: true,
			runIn: [ 'text' ],
			requiredPermissions: [],
			guarded: true,
			cooldown: 5,
			description: 'Muestra las stats de un usuario del servidor.',
			extendedHelp: '!stats [usuario - mención o ID]',
			quotedStringSupport: false,
			usage: '[user:member]',
			usageDelim: ' ',
		});
	}

	async run(message: KlasaMessage, [member]: [GuildMember]) {
		let user:KlasaUser;

		// Hacer esto es muchísimo más rápido que hacer un if que repita el mismo código
		if(member) user = member.user;
		else user = message.author;

		const embed = new MessageEmbed()
		.setColor(message.guild.me.displayColor || 'BLUE')
		.setTitle(`Estadísticas de ${user.username}`)
		.setThumbnail(user.avatarURL({ format: 'png', dynamic: true }))
		.addField('Nombre completo', user.tag, true);
		if(message.guild.settings.get('settings.leveling')) {
			embed.addField('Experiencia', user.settings.get('xp'), true);
			embed.addField('Experiencia restante', (((user.settings.get('level') * 1024) * 1.5) / 2) - user.settings.get('xp'));
			embed.addField('Nivel', user.settings.get('level'), true);
		}
		embed.addFields(
			{ name: 'Advertencias', value: user.settings.get('warns'), inline: true },
			{ name: 'Kicks', value: user.settings.get('kicks'), inline: true }
		);
		
		return message.send(embed);
	}
}