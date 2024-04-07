import { discogsGet, discogsPost } from '$lib/discogs-api';
import { PRIVATE_DISCOGS_FOLDER } from '$env/static/private';
import { error } from '@sveltejs/kit';
import { DiscogsCache } from './+layout.server';

/** @type {import('./$types').Actions} */
export const actions = {

	searchByBarcode: async ({ request, fetch }) => {
		const data = await request.formData();
		const barcode = data.get('barcode');
		const searchResults = await discogsGet({ path: `/database/search?barcode=${barcode}`, fetch });
		return { searchResults };
	},
	searchByQuery: async ({ request, fetch }) => {
		const data = await request.formData();
		const query = data.get('query');
		const searchResults = await discogsGet({ path: `/database/search?q=${query}&type=release`, fetch });
		return { searchResults };
	},

	updateCollection: async ({ request, fetch }) => {
		const data = await request.formData();
		const release_id = data.get('release_id');
		const collectionAction = data.get('collection_action');
		const folder_id = PRIVATE_DISCOGS_FOLDER || '1';

		switch (collectionAction) {
			case 'add': {
				const result = await discogsPost({
					path: `/users/{username}/collection/folders/${folder_id}/releases/${release_id}`,
					fetch
				});
				DiscogsCache.timestamp = Number.MAX_VALUE;
				return result;
			}
			case 'remove':
				error(400, `remove not implemented`);
			// return await discogsPost({
			// 	path: `/users/{username}/collection/folders/${folder_id}/releases/${release_id}`,
			// 	fetch
			// });
		}
		error(400, `unknown collection action ${collectionAction}`);
	}

};
