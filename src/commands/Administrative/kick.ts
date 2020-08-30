import { GuildMember, MessageEmbed, TextChannel } from 'discord.js';
import { Command, CommandStore, KlasaMessage } from 'klasa';
import * as MongUtils from '../../client/utils';

export default class extends Command {
	constructor(store: CommandStore, file: string[], dir: string) {
		super(store, file, dir, {
			enabled: true,
			runIn: [ 'text' ],
			requiredPermissions: ['KICK_MEMBERS'],
			guarded: true,
			description: 'Expulsa a un usuario del servidor.',
			extendedHelp: '!kick <usuario - mención o ID> [razón]',
			quotedStringSupport: false,
			usage: '<user:member> [reason:...string]',
			usageDelim: ' ',
		});
	}

	async run(message: KlasaMessage, [member, reason]: [GuildMember, string]) {
		if(!MongUtils.hasRoles(message.member) && !message.member.hasPermission("KICK_MEMBERS"))
			return message.send('🚫 No tienes permisos para usar este comando.');
		if(!member) return message.send('🚫 Necesitas mencionar a un miembro para usar este comando.');
		if(member.roles.highest.position >= message.member.roles.highest.position) return message.send('🚫 No puedes kickear a este usuario.');
		if(member.id === message.author.id) return message.send('🚫 No puedes kickearte a ti mismo.');
		if(member.id === this.client.user.id) return message.send('🚫 ¡No puedes kickearme a mi!');
		if(!member.kickable) return message.send('🚫 Este usuario no puede ser kickeado.');

		const userembed = new MessageEmbed()
		.setColor('RED')
		.setTitle('Expulsado')
		.setDescription(`Fuiste expulsado del servidor por ${message.author.tag}. Razón: ${reason ? reason : 'Sin razón.'}`)
		.setFooter(`ID: ${message.author.id}`)
		.setTimestamp();
		await member.user.send(userembed).catch((err) => {
			if(err.message.includes("Cannot send messages to this user")) {
				console.error(err);
			}
		});

		await member.user.settings.update('kicks', member.user.settings.get('kicks') + 1);
		
		await member.kick(reason ? reason : 'Sin razón.');

		const embed = new MessageEmbed()
		.setColor('RED')
		.setAuthor(`Emitido por ${message.author.tag}`, message.author.avatarURL({ format: 'png', dynamic: true }))
		.setTitle('Miembro expulsado')
		.setDescription(`${member.user.tag} fue expulsado del servidor. Razón: ${reason ? reason : 'Sin razón.'}`)
		.setFooter(`ID: ${message.author.id}`)
		.setTimestamp();
		message.send(embed);

		const logs = this.client.channels.cache.get(message.guild.settings.get('channels.logs')) as TextChannel;

		if(logs) logs.send(embed);
	}
}
