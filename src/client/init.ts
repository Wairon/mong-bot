import { Client, KlasaClient, KlasaClientOptions } from 'klasa';

export default class MongBot extends KlasaClient {
	constructor(options: KlasaClientOptions) {
		super(options);
		Client.defaultGuildSchema
		.add('channels', (folder) => {
			folder.add('logs', 'TextChannel');
			folder.add('bots', 'TextChannel');
			folder.add('welcomes', 'TextChannel');
		})
		.add('roles', (folder) => {
			folder.add('muted', 'String');
			folder.add('member', 'String', { array: true });
			folder.add('moderator', 'String');
			folder.add('admin', 'String');
			folder.add('owner', 'String');
			folder.add('nofilter', 'String');
		})
		.add('settings', (folder) => {
			folder.add('filter', 'boolean', { default: false, configurable: false });
			folder.add('leveling', 'boolean', { default: true, configurable: false });
			folder.add('strictfilter', 'boolean', { default: false, configurable: false });
			folder.add('ip', 'string');
			folder.add('verification', 'string');
			folder.add('commands', 'any', { array: true, configurable: false });
		})
		.add('filter', (folder) => {
			folder.add('names', 'boolean', { default: false, configurable: false });
			folder.add('words', 'boolean', { default: false, configurable: false });
			folder.add('invites', 'boolean', { default: false, configurable: false });
			folder.add('nudity', 'boolean', { default: false, configurable: false });
			folder.add('filterlist', 'string', { array: true });
		});

		Client.defaultUserSchema
		.add('muted', 'boolean', { default: false, configurable: false })
		.add('xp', 'integer', { default: 0, configurable: false })
		.add('level', 'integer', { default: 1, configurable: false })
		.add('warns', 'integer', { default: 0, configurable: false })
		.add('kicks', 'integer', { default: 0, configurable: false });
	}
}