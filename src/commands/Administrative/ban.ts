import { GuildMember, MessageEmbed, TextChannel } from 'discord.js';
import { Command, CommandStore, KlasaMessage } from 'klasa';
import * as MongUtils from '../../client/utils';

export default class extends Command {
	constructor(store: CommandStore, file: string[], dir: string) {
		super(store, file, dir, {
			enabled: true,
			runIn: [ 'text' ],
			requiredPermissions: ['BAN_MEMBERS'],
			guarded: true,
			description: 'Banea a un usuario del servidor.',
			extendedHelp: '!ban <usuario - mención o ID> [razón]',
			quotedStringSupport: false,
			usage: '<user:member> [reason:...string]',
			usageDelim: ' ',
		});
	}

	async run(message: KlasaMessage, [member, reason]: [GuildMember, string]) {
		if(!MongUtils.hasRoles(message.member) && !message.member.hasPermission("BAN_MEMBERS"))
			return message.send('🚫 No tienes permisos para usar este comando.');
		if(!member) return message.send('🚫 Necesitas mencionar a un miembro para usar este comando.');
		if(member.roles.highest.position >= message.member.roles.highest.position) return message.send('🚫 No puedes banear a este usuario.');
		if(member.id === message.author.id) return message.send('🚫 No puedes banearte a ti mismo.');
		if(member.id === this.client.user.id) return message.send('🚫 ¡No puedes banearme a mi!');
		if(!member.bannable) return message.send('🚫 Este usuario no puede ser baneado.');

		const userembed = new MessageEmbed()
		.setTitle('Baneado')
		.setDescription(`Fuiste baneado del servidor por ${message.author.tag}. Razón: ${reason ? reason : 'Sin razón.'}`)
		.setFooter(`ID: ${message.author.id}`)
		.setTimestamp();
		await member.user.send(userembed).catch((err) => {
			if(err.message.includes("Cannot send messages to this user")) {
				console.error(err);
			}
		});

		await member.ban({ days: 0, reason: reason ? reason : 'Sin razón.' });
		const embed = new MessageEmbed()
		.setColor('RED')
		.setAuthor(`Emitido por ${message.author.tag}`, message.author.avatarURL({ format: 'png', dynamic: true }))
		.setTitle('Miembro baneado')
		.setDescription(`El miembro ${member.user.tag} (ID: ${member.user.id}) fue baneado del servidor. Razón: ${reason ? reason : 'Sin razón.'}`)
		.setFooter(`ID: ${message.author.id}`)
		.setTimestamp();
		message.send(embed);

		const logs = this.client.channels.cache.get(message.guild.settings.get('channels.logs')) as TextChannel;

		if(logs) logs.send(embed);
	}
}
