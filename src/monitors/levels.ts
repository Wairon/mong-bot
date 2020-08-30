import { KlasaMessage, Monitor, MonitorStore } from 'klasa';

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
		if(!message.guild || !message.guild.settings.get('settings.leveling')) return;

		const xp = await message.author.settings.get('xp');
		const level = await message.author.settings.get('level');
		await message.author.settings.update('xp', xp + 1);

		if(((level * 1024) * 1.5) / 2 <= xp + 1) {
			await message.author.settings.update('level', level + 1);
			message.send(`🥳 ¡Felicidades, ${message.author}, subiste al nivel ${level + 1}!`)
		}
	}
}