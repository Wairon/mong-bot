import { MessageEmbed, TextChannel, Guild, GuildMember } from 'discord.js';
import { Task, TaskStore } from 'klasa';

type UnmuteData = {
	guild: string;
	user: string;
};

export default class extends Task {
	constructor(store: TaskStore, file: string[], dir: string) {
		super(store, file, dir, { enabled: true });
	}

	async run(data: UnmuteData) {
		const guild = this.client.guilds.cache.get(data.guild) as Guild;
		if(!guild) return;

		const member = guild.members.cache.get(data.user) as GuildMember;
		if(!member) return;

		if(!member.user.settings.get('muted')) return;
		
		await member.user.settings.update('muted', false);
		if(member.roles.cache.has(guild.settings.get('roles.muted'))) await member.roles.remove(guild.settings.get('roles.muted'));
		
		const userembed = new MessageEmbed()
		.setColor('BLUE')
		.setTitle('Desmuteado')
		.setDescription(`Fuiste desmuteado de \`${guild.name}\` por haber cumplido el tiempo.`)
		.setTimestamp()
		await member.user.send(userembed).catch((err) => {
			if(err.message.includes("Cannot send messages to this user")) {
				console.error(err);
			}
		});

		const logs = this.client.channels.cache.get(guild.settings.get('channels.logs')) as TextChannel;

		if(logs) {
			const embed = new MessageEmbed()
			.setColor('GREEN')
			.setTitle('Miembro desmuteado')
			.setDescription(`${member} fue desmuteado automaticamente por haber cumplido el tiempo de mute.`)
			.setTimestamp();
			logs.send(embed);
		}
	}
}