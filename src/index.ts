import { Router } from 'itty-router';
import { getData } from './routes/discord';

export interface Env {
	DISCORD_BOT_TOKEN: string;
	DISCORD_OWNER_ID: string;
}

const router = Router();

const resJson = (obj: any) =>
	new Response(JSON.stringify(obj), { headers: { 'content-type': 'application/json' } });

router.get('/', async () => {
	return new Response(':D');
});

router.get('/discord/:user', async (request, env: Env) => {
	if (!env[`OWNER_${request.params.user.toUpperCase()}`])
		return new Response(`No owner id for ${request.params.user}`, { status: 404 });

	return resJson(
		await getData(env[`OWNER_${request.params.user.toUpperCase()}`], env.DISCORD_BOT_TOKEN)
	);
});

export default {
	fetch: router.handle,
};
