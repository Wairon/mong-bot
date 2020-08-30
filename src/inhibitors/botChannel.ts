import { Inhibitor, KlasaMessage, Command } from 'klasa';
import { TextChannel } from 'discord.js';

export default class extends Inhibitor {
	async run(message: KlasaMessage, cmd: Command) {
		if(cmd.category !== "Administrative" && message.guild.settings.get('channels.bots') && message.channel.id !== message.guild.settings.get('channels.bots')) {
			const channel = this.client.channels.cache.get(message.guild.settings.get('channels.bots')) as TextChannel;
			throw await message.send(`🚫 Los comandos \`no administrativos\` solo pueden ser usados en el canal ${channel}.`);
		}
	}
}