import { Event, EventStore, KlasaMessage } from 'klasa';

export default class extends Event {
	constructor(store: EventStore, file: string[], dir: string) {
		super(store, file, dir, {
			enabled: true,
			once: false,
			event: 'message'
		});
	}

	async run(message: KlasaMessage) {
		if(message.author.settings.get('muted') && !message.author.bot)
			return await message.delete();
	}
}