import { GuildMember } from 'discord.js';
import * as path from 'path';

export function hasRoles(member: GuildMember):boolean {
	const admin = member.guild.settings.get('roles.admin');
	const mod = member.guild.settings.get('roles.moderator');
	const owner = member.guild.settings.get('roles.owner');

	if(mod && member.roles.cache.has(mod))
		return true;
	
	if(admin && member.roles.cache.has(admin))
		return true;

	if(owner && member.roles.cache.has(owner))
		return true;

	return false;
}

export function getFileExtension(string: string):string {
	return path.extname(string).replace('.', '');
}

export type CommandArguments = {
	name?: string,
	content?: string
};