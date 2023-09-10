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

router.get('/discord', async (request, env: Env) => {
	return resJson(await getData(env.DISCORD_OWNER_ID, env.DISCORD_BOT_TOKEN));
});

export default {
	fetch: router.handle,
};
