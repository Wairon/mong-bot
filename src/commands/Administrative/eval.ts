import { Command, CommandStore, KlasaMessage } from 'klasa';

export default class extends Command {
	constructor(store: CommandStore, file: string[], dir: string) {
		super(store, file, dir, {
			enabled: true,
			runIn: [ 'text', 'dm' ],
			requiredPermissions: [],
			guarded: true,
			permissionLevel: 10,
			description: 'Evalúa una expresión TypeScript/JavaScript.',
			extendedHelp: '!eval <expr>',
			quotedStringSupport: false,
			usage: '<eval:...string>',
			usageDelim: ' ',
		});
	}

	async run(message: KlasaMessage, [exp]: [string]) {
		const result = await eval(exp);
		return message.send(`\`\`\`ts\n${result}\n\`\`\``);
	}
}