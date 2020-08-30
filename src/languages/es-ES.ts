import { Language, LanguageStore } from 'klasa';
import { config } from '../config';

export default class extends Language {
	constructor(store: LanguageStore, file: string[], dir: string) {
		super(store, file, dir);

		this.language = {
			DEFAULT: (key) => `La opción \`${key}\` aún no ha sido traducida al español.`,
			PREFIX_REMINDER: `hola che, el prefix del servidor es \`${config.prefix}\``,
			INHIBITOR_COOLDOWN: (remaining) => `🚫 Acabas de usar este comando, lo podrás usar de nuevo en ${remaining} segundos.`,
			RESOLVER_INVALID_MEMBER: (name) => `🚫 Necesitas mencionar a alguien para usar este comando.`,
			RESOLVER_INVALID_USER: (name) => `🚫 Necesitas mencionar a un usuario para usar este comando.`,
			RESOLVER_INVALID_DURATION: (name) => `🚫 Proporcionaste una duración inválida.`,
			RESOLVER_INVALID_TIME: (name) => `🚫 Proporcionaste un tiempo inválido.`,
			RESOLVER_INVALID_INT: (name) => `🚫 Proporcionaste una cantidad inválida.`,
			RESOLVER_INVALID_CUSTOM: (name, type) => `🚫 Proporcionaste una opción de tipo \`${type}\` inválida.`,
			COMMANDMESSAGE_MISSING: '🚫 Proporcionaste una cantidad inválida de argumentos para el comando.',
			COMMANDMESSAGE_MISSING_REQUIRED: (name) => `🚫 \`${name}\` es un argumento requerido.`,
			INHIBITOR_MISSING_BOT_PERMS: (missing) => `🚫 Permisos insuficientes! Necesito: \`${missing}\``
		}
	}

	async init() {
		await super.init();
	}
}