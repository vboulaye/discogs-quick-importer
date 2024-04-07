import { error } from '@sveltejs/kit';
import { PRIVATE_DISCOGS_URL, PRIVATE_DISCOGS_USER_LOGIN, PRIVATE_DISCOGS_USER_TOKEN } from '$env/static/private';

export type Fetch = (input: (RequestInfo | URL), init?: RequestInit) => Promise<Response>

export async function discogsGet(options: { path: string, method?: string, body?: unknown, fetch: Fetch }) {
	try {

		const executablePath = options.path.replace('{username}', PRIVATE_DISCOGS_USER_LOGIN);
		const response = await options.fetch(`${PRIVATE_DISCOGS_URL}${executablePath}`, {
			method: options.method ?? 'GET',
			headers: {
				Authorization: `Discogs token=${PRIVATE_DISCOGS_USER_TOKEN}`,
				'Content-Type': 'application/json'
			},
			body: options.body ? JSON.stringify(options.body) : undefined
		});
		const responseData = await response.json();
		if (!response.ok) {
			throw new Error('unable to call gitlab api: ' + JSON.stringify(responseData));
		}
		return responseData;
	} catch (e) {
		error(500, 'unable to call gitlab api: ' + JSON.stringify(e));
	}
}

export async function discogsPost(options: { path: string, body?: unknown; fetch: Fetch }) {
	return await discogsGet({ ...options, method: 'POST' });
}

