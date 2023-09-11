import { type APIUser, UserFlags } from 'discord-api-types/v10';

interface iDiscordUser {
	username: string;
	displayName: string;
	banner_color: string;
	avatar_url: string;
	flagImages: { [key: string]: string };
	id: string;
}

interface iClientModBadge {
	name: string;
	badge: string;
}

const flagToImage = {
	ActiveDeveloper: 'activedeveloper',
	BugHunterLevel1: 'bughunterlevel1',
	BugHunterLevel2: 'bughunterlevel2',
	CertifiedModerator: 'certifiedmod',
	HypeSquadOnlineHouse1: 'hypesquadbravery',
	HypeSquadOnlineHouse2: 'hypesquadbrilliance',
	HypeSquadOnlineHouse3: 'hypesquadbalance',
	Hypesquad: 'hypesquadevents',
	Partner: 'discordpartner',
	PremiumEarlySupporter: 'earlysupporter',
	Staff: 'discordstaff',
	VerifiedDeveloper: 'earlyverifiedbotdev',
};

interface objResponse {
	badge: string;
	name: string;
}
interface badgeApiResponse {
	[key: string]: string[] | objResponse[];
}

let DiscordUser = {} as iDiscordUser;

let isWaiting = false;

export async function getData(ownerId: string, token: string) {
	if (isWaiting) return DiscordUser;
	const data = await fetch(`https://discord.com/api/v10/users/${ownerId}`, {
		headers: {
			Authorization: `Bot ${token}`,
		},
	});
	const json = (await data.json()) as APIUser;
	console.log(json);
	const _DiscordUser: iDiscordUser = {
		username: json.username,
		displayName: json.global_name || json.username,
		banner_color: json.accent_color ? `#${json.accent_color?.toString(16)}` : 'unset',
		avatar_url:
			`https://cdn.discordapp.com/avatars/${json.id}/${json.avatar}.png` ||
			'https://canary.discord.com/assets/1f0bfc0865d324c2587920a7d80c609b.png',
		flagImages: {},
		id: json.id,
	};
	if (json.flags) {
		Object.keys(UserFlags)
			.filter(key => json.flags! & UserFlags[key])
			.map(
				image =>
					(_DiscordUser.flagImages[
						image
					] = `https://raw.githubusercontent.com/efeeozc/discord-badges/main/png/${flagToImage[image]}.png`)
			);
	}

	const modBadges = (await fetch(
		`https://clientmodbadges-api.herokuapp.com/users/${_DiscordUser.id}`
	).then(res => res.json())) as badgeApiResponse;
	Object.entries(modBadges).forEach(data => {
		data[1].forEach((badge: string | iClientModBadge) => {
			if (typeof badge === 'string') {
				_DiscordUser.flagImages[
					badge
				] = `https://clientmodbadges-api.herokuapp.com/badges/${data[0]}/${badge}`;
			} else {
				_DiscordUser.flagImages[badge.name] = badge.badge;
			}
		});
	});

	DiscordUser = _DiscordUser;
	isWaiting = true;
	setTimeout(() => {
		isWaiting = false;
	}, 1000 * 60 * 10);
	return _DiscordUser;
}
