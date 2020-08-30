import { KlasaMessage, Monitor, MonitorStore } from 'klasa';
import { TextChannel, MessageEmbed } from 'discord.js';
import { getFileExtension } from '../client/utils';
import * as deepai from 'deepai';
import axios from 'axios';

deepai.setApiKey('f2c83641-543b-47d9-85be-7ba244dec7c9');
const formats = [
	'jpg', 'png', 'webp', 
	'gif', 'gifv', 'jpeg'
];

const forbiddenChannels = [
	'699690849717583902', '679455463141670971', '723558983125827654',
]

type ImageData = {
	confidence: number,
	bounding_box: Array<number>,
	name: string
};

export default class extends Monitor {
	constructor(store: MonitorStore, file: string[], dir: string) {
		super(store, file, dir, {
			enabled: true,
			ignoreBots: true,
			ignoreSelf: true,
			ignoreOthers: false,
			ignoreWebhooks: true,
			ignoreEdits: false,
		});
	}

	async run(message: KlasaMessage)
	{
		if(forbiddenChannels.includes(message.channel.id)) return;
		if(message.channel.type !== 'text') return;
		if(message.channel.nsfw) return;
		if(!message.attachments.first()) return;
		if(!message.guild.settings.get('settings.filter')) return;
		if(!message.guild.settings.get('filter.nudity')) return;
		if(message.channel.id === message.guild.settings.get('channels.logs')) return;

		if(formats.includes(getFileExtension(message.attachments.first().url))) {
			const response = await deepai.callStandardApi("nsfw-detector", {
				image: message.attachments.first().url,
			});

			let detections = 0;

			if(response.output.detections.length > 0) {
				response.output.detections.forEach((val) => {
					if(this.isNSFW(val, message.guild.settings.get('settings.strictfilter')) && val.confidence >= 0.47)
						detections++;
				});
			}

			if(detections > 1 && response.output.nsfw_score >= 0.010)
			{
				let image;
				await axios.get(message.attachments.first().url, { responseType: 'arraybuffer' }).then(resp => {
					image = Buffer.from(resp.data, 'binary');
				});

				await message.delete();

				message.send(`**¡Mesaje eliminado!** ${message.author} tu mensaje fue eliminado porque contenía una imagen inapropiada.`).then(function(m: KlasaMessage){m.delete({ timeout: 20000 });});

				const logs = this.client.channels.cache.get(message.guild.settings.get('channels.logs')) as TextChannel;
				if(logs) {
					const error = new MessageEmbed()
					.setColor('RED')
					.setAuthor(`Advertencia sobre ${message.author.tag}`, message.author.avatarURL({ format: 'png', dynamic: true }))
					.setTitle('Imagen inapropiada publicada')
					.attachFiles([{ attachment: image, name: `${message.attachments.first().name}.${getFileExtension(message.attachments.first().url)}`}])
					.setDescription(`Canal ${message.channel}`)
					.setImage(`attachment://${message.attachments.first().name}.${getFileExtension(message.attachments.first().url)}`)
					.setFooter(`ID: ${message.author.id}`)
					.setTimestamp();
					logs.send(error);
				}
			}
		}

		return 1;
	}

	isNSFW(data: ImageData, strict: boolean):boolean {

		/*		Female Breasts		*/
		if(strict) {
			if(data.name.includes('Female Breast - Covered'))
				return true;
		}

		if(data.name.includes('Female Breast - Exposed'))
			return true;

		/*			Genitalia		*/
		if(data.name.includes('Genitalia - Exposed'))
			return true;

		/*			Buttocks		*/
		if(data.name.includes('Buttocks - Exposed'))
			return true;

		return false;
	}
}