import { GuildMember, MessageEmbed, TextChannel } from 'discord.js';
import { Command, CommandStore, KlasaMessage } from 'klasa';
import * as MongUtils from '../../client/utils';

export default class extends Command {
	constructor(store: CommandStore, file: string[], dir: string) {
		super(store, file, dir, {
			enabled: true,
			aliases: [ 'desmute' ],
			runIn: [ 'text' ],
			requiredPermissions: ['MANAGE_ROLES'],
			guarded: true,
			description: 'Desmutea a un usuario.',
			extendedHelp: '!unmute <usuario - mención o ID>',
			quotedStringSupport: false,
			usage: '<user:member>',
			usageDelim: ' ',
		});
	}

	async run(message: KlasaMessage, [member]: [GuildMember]) {
		if(!MongUtils.hasRoles(message.member) && !message.member.hasPermission("MANAGE_MESSAGES"))
			return message.send('🚫 No tienes permisos para usar este comando.');
		if(!member) return message.send('🚫 Necesitas mencionar a un miembro para usar este comando.');
		if(member.roles.highest.position >= message.member.roles.highest.position) return message.send('🚫 No puedes desmutear a este usuario.');
		if(member.id === message.author.id) return message.send('🚫 No puedes desmutearte a ti mismo.');
		if(!member.user.settings.get('muted')) return message.send('🚫 El usuario no está muteado.');

		await member.user.settings.update('muted', false);
		if(message.guild.settings.get('roles.muted') && member.roles.cache.has(message.guild.settings.get('roles.muted'))) await member.roles.remove(message.guild.settings.get('roles.muted'));

		const logs = this.client.channels.cache.get(message.guild.settings.get('channels.logs')) as TextChannel;
		const embed = new MessageEmbed()
		.setColor('GREEN')
		.setAuthor(`Emitido por ${message.author.tag}`, message.author.avatarURL({ format: 'png', dynamic: true }))
		.setTitle('Miembro desmuteado')
		.setDescription(`${member.user.tag} fue desmuteado.`)
		.setFooter(`ID: ${message.author.id}`)
		.setTimestamp();
		message.send(embed);

		if(logs) logs.send(embed);
	}
}
