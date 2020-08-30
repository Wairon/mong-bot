import { TextChannel, MessageEmbed } from 'discord.js';
import { Command, CommandStore, KlasaMessage } from 'klasa';
import * as MongUtils from '../../client/utils';

export default class extends Command {
	constructor(store: CommandStore, file: string[], dir: string) {
		super(store, file, dir, {
			enabled: true,
			runIn: [ 'text' ],
			aliases: ['prune'],
			requiredPermissions: ['MANAGE_MESSAGES'],
			guarded: true,
			description: 'Limpia mensajes en un canal.',
			extendedHelp: '!clear <cantidad>',
			quotedStringSupport: false,
			usage: '<amount:integer>',
			usageDelim: ' ',
		});
	}

	async run(message: KlasaMessage, [amount]: [number]) {
		if(!MongUtils.hasRoles(message.member) && !message.member.hasPermission("MANAGE_MESSAGES"))
			return message.send('🚫 No tienes permisos para usar este comando.');
		if(amount < 0 || 150 < amount) return message.send('🚫 Cantidad inválida introducida. Rangos aceptables: 0-150.');

		const channel = message.channel as TextChannel;
		const logs = this.client.channels.cache.get(message.guild.settings.get('channels.logs')) as TextChannel;

		await channel.bulkDelete(amount + 1, false);

		const msg = await channel.send(`✅ ${amount} mensaje${amount > 1 ? 's' : ''} eliminado${amount > 1 ? 's' : ''}.`);
		setTimeout(function(){
			msg.delete();
		}, 2000);

		if(logs) {
			const embed = new MessageEmbed()
			.setColor('RED')
			.setAuthor(`Emitido por ${message.author.tag}`, message.author.avatarURL({ format: 'png', dynamic: true }))
			.setTitle(`${amount} mensaje${amount > 1 ? 's' : ''} limpiado${amount > 1 ? 's' : ''}`)
			.addField('Canal', message.channel);
			logs.send(embed);
		}
	}
}
