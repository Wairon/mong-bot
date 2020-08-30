import { GuildMember, MessageEmbed, TextChannel } from 'discord.js';
import { Command, CommandStore, KlasaMessage } from 'klasa';
import * as moment from 'moment';
import * as MongUtils from '../../client/utils';

export default class extends Command {
	constructor(store: CommandStore, file: string[], dir: string) {
		super(store, file, dir, {
			enabled: true,
			runIn: [ 'text' ],
			requiredPermissions: ['MANAGE_ROLES'],
			guarded: true,
			description: 'Mutea a un usuario.',
			extendedHelp: '!mute <usuario - mención o ID> [razón] [tiempo; m = minuto, h = horas, d = días]',
			quotedStringSupport: true,
			usage: '<user:member> [duration:time] [reason:...string]',
			usageDelim: ' ',
		});
	}

	async run(message: KlasaMessage, [member, duration, reason]: [GuildMember, Date, string]) {
		if(!MongUtils.hasRoles(message.member) && !message.member.hasPermission("MANAGE_MESSAGES")) return message.send('🚫 No tienes permisos para usar este comando.');
		if(!member) return message.send('🚫 Necesitas mencionar a un miembro para usar este comando.');
		if(member.roles.highest.position >= message.member.roles.highest.position) return message.send('🚫 No puedes mutear a este usuario.');
		if(member.id === message.author.id) return message.send('🚫 No puedes mutearte a ti mismo.');
		if(member.id === this.client.user.id) return message.send('🚫 ¡No puedes mutearme a mi!');
		if(member.roles.cache.has(message.guild.settings.get('roles.muted')) || member.user.settings.get('muted')) return message.send('🚫 El usuario ya está muteado.');
		
		await member.user.settings.update('muted', true);
		if(message.guild.settings.get('roles.muted')) await member.roles.add(message.guild.settings.get('roles.muted'));

		if(duration !== null || duration !== undefined) {
			if(Object.prototype.toString.call(duration) === "[object Date]" && !isNaN(duration.getTime())) {
				await this.client.schedule.create('unmute', duration, {
					data: {
						guild: message.guild.id,
						user: member.id,
					},
					catchUp: true,
				});
			}
		}

		const logs = this.client.channels.cache.get(message.guild.settings.get('channels.logs')) as TextChannel;
		const embed = new MessageEmbed()
		.setColor('RED')
		.setAuthor(`Emitido por ${message.author.tag}`, message.author.avatarURL({ format: 'png', dynamic: true }))
		.setTitle('Miembro muteado')
		.addFields(
			{ name: 'Miembro', value: member.user.tag, inline: true },
			{ name: 'Duración', value: duration ? moment().locale('es').to(duration.toISOString(), true) : 'Indefinido', inline: true },
			{ name: 'Razón', value: reason ? reason : 'Sin razón', inline: true }
		)
		.setFooter(`ID: ${message.author.id}`)
		.setTimestamp();
		message.send(embed);

		if(logs) logs.send(embed);
	}
}
