import { GuildMember, MessageEmbed, TextChannel } from 'discord.js';
import { Command, CommandStore, KlasaMessage } from 'klasa';
import * as MongUtils from '../../client/utils';

export default class extends Command {
	constructor(store: CommandStore, file: string[], dir: string) {
		super(store, file, dir, {
			enabled: true,
			runIn: [ 'text' ],
			aliases: ['adv', 'advertir'],
			requiredPermissions: [],
			guarded: true,
			description: 'Advierte a un usuario del servidor.',
			extendedHelp: '!warn <usuario - mención o ID> [razón]',
			quotedStringSupport: false,
			usage: '<member:member> [reason:...string]',
			usageDelim: ' ',
		});
	}

	async run(message: KlasaMessage, [member, reason]: [GuildMember, string]) {
		if(!MongUtils.hasRoles(message.member)) return message.send('🚫 No tienes permisos para usar este comando.');
		if(!member) return message.send('🚫 Necesitas mencionar a un miembro para usar este comando.');
		if(member.roles.highest.position >= message.member.roles.highest.position) return message.send('🚫 No puedes advertir a este usuario.');
		if(member.id === message.author.id) return message.send('🚫 No puedes advertirte a ti mismo.');
		if(member.id === this.client.user.id) return message.send('🚫 ¡No puedes advertirme a mi!');

		const userembed = new MessageEmbed()
		.setColor('RED')
		.setTitle('Advertido')
		.setDescription(`Fuiste advertido en \`${message.guild.name}\` por ${message.author.tag}. Razón: ${reason ? reason : 'Sin razón.'}`)
		.setFooter(`ID: ${message.author.id}`)
		.setTimestamp();
		await member.user.send(userembed).catch((err) => {
			if(err.message.includes("Cannot send messages to this user")) {
				console.error(err);
			}
		});

		await member.user.settings.update('warns', member.user.settings.get('warns') + 1);
		const embed = new MessageEmbed()
		.setColor('RED')
		.setAuthor(`Emitido por ${message.author.tag}`, message.author.avatarURL({ format: 'png', dynamic: true }))
		.setTitle('Miembro advertido')
		.setDescription(`${member.user.tag} fue advertido. Razón: ${reason ? reason : 'Sin razón.'}`)
		.setFooter(`ID: ${message.author.id}`)
		.setTimestamp();
		message.send(embed);

		const logs = this.client.channels.cache.get(message.guild.settings.get('channels.logs')) as TextChannel;
		if(logs) logs.send(embed);
	}
}