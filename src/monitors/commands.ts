import { KlasaMessage, Monitor, MonitorStore } from 'klasa';
import { CommandArguments } from '../client/utils';

export default class extends Monitor {
	constructor(store: MonitorStore, file: string[], dir: string) {
		super(store, file, dir, {
			enabled: true,
			ignoreBots: true,
			ignoreSelf: true,
			ignoreOthers: false,
			ignoreWebhooks: true,
			ignoreEdits: true,
		});
	}

	async run(message: KlasaMessage) {
		if(!message.content.startsWith(this.client.options.prefix as string)) return;
		if(message.author.settings.get('muted')) return;
		const cmdName = message.content.slice(this.client.options.prefix.length).split(' ')[0];

		const commands:Array<CommandArguments> = message.guild.settings.get('settings.commands');
		if(!commands) return;

		commands.forEach(async (val: CommandArguments) => {
			if(val.name === cmdName) {
				return await message.send(val.content);
			}
		});
	}
}