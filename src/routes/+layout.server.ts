import type { LayoutServerLoad } from './$types';
import { discogsGet } from '$lib/discogs-api';


export const DiscogsCache = {
	timestamp: Number.MAX_VALUE,
	discogsUser: null,
	discogsCollectionLatestReleases: null
};

export const load: LayoutServerLoad = async ({ fetch }) => {

	// cache for 10 seconds
	const cacheDuration = 10;
	if (DiscogsCache.timestamp <= Date.now() + 1000 * cacheDuration) {
		return DiscogsCache;
	}

	const discogsUserPromise = discogsGet({ path: `/users/{username}`, fetch });
	const folder_id = '0'; // 0 is all
	const discogsCollectionLatestReleasesPromise = discogsGet({
		path: `/users/{username}/collection/folders/${folder_id}/releases?sort=added&sort_order=desc&page=1&per_page=75`,
		fetch
	});
	DiscogsCache.discogsUser = await discogsUserPromise;
	DiscogsCache.discogsCollectionLatestReleases = await discogsCollectionLatestReleasesPromise;
	DiscogsCache.timestamp = Date.now();
	return DiscogsCache;
};
