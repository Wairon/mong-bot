import { GuildMember, MessageEmbed } from 'discord.js';
import { Command, CommandStore, KlasaMessage } from 'klasa';

export default class extends Command {
	constructor(store: CommandStore, file: string[], dir: string) {
		super(store, file, dir, {
			enabled: true,
			runIn: [ 'text' ],
			cooldown: 10,
			cooldownLevel: 'channel',
			requiredPermissions: [],
			guarded: true,
			description: 'Muestra el avatar de un usuario.',
			extendedHelp: '!avatar <usuario - mención o ID>',
			quotedStringSupport: false,
			usage: '[user:member]',
			usageDelim: ' ',
		});
	}

	async run(message: KlasaMessage, [member]: [GuildMember]) {
		let user;
 
		if(member) user = member.user;
		else user = message.author;

		const embed = new MessageEmbed()
		.setColor(message.guild.me.displayColor || 'BLUE')
		.setTitle(`Avatar de ${user.tag}`)
		.addField('Enlaces', `[png](${user.avatarURL({ format: 'png', size: 4096 })}) | [webp](${user.avatarURL({ format: 'webp', size: 4096 })})`)
		.setImage(user.avatarURL({ format: 'png', dynamic: true, size: 1024 }))
		.setFooter(`Solicitado por ${message.author.tag}`);
		return await message.send(embed);
	}
}