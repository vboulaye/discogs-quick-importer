<script lang="ts">

	import { enhance } from '$app/forms';

	/** @type {import('./$types').PageData} */
	export let data;

	/** @type {import('./$types').ActionData} */
	export let form;

	const lastCollectionReleases = data.discogsCollectionLatestReleases.releases.map(release => release.id);

	let updateCollectionForm: HTMLFormElement;

	function cleanup(...elements: (string | string[] | undefined)[]) {
		const result = [];
		for (const element of elements) {
			if (element) {
				if ((typeof element) === 'string') {
					if (!result.includes(element)) {
						result.push(element);
					}
				} else {
					for (const el2 of elements) {
						if (el2 && !result.includes(el2)) {
							result.push(el2);
						}
					}
				}
			}
		}
		result.sort();
		return result;
	}

	async function updateCollection(release) {
		updateCollectionForm.release_id.value = release.id;
		updateCollectionForm.collection_action.value = release.user_data.in_collection ? 'remove' : 'add';
		updateCollectionForm.submit();
	}

	function isInCollection(release) {
		return release.user_data.in_collection || lastCollectionReleases.includes(release.id);
	}

</script>

<section>
	<fieldset>
		<legend>Barcode Search</legend>
		<form method="POST" action="?/searchByBarcode" use:enhance>
			<label>
				Barcode
				<input name="barcode" type="text" required autofocus>
			</label>
			<button>Search</button>
		</form>
	</fieldset>
	<fieldset>
		<legend>Generic Search</legend>
		<form method="POST" action="?/searchByQuery" use:enhance>
			<label>
				Query
				<input name="query" type="text" required>
			</label>
			<button>Search</button>
		</form>
	</fieldset>
</section>

<section>
	{#if form?.searchResults}

		<form bind:this={updateCollectionForm} method="POST" action="?/updateCollection" use:enhance>
			<input type="hidden" name="collection_action">
			<input type="hidden" name="release_id">
		</form>

		<table>
			<tr>

				<th style="width: 3rem">cover</th>
				<th style="min-width: 50rem">title</th>
				<th style="width: 3rem">year - country</th>
				<th style="width: 3rem">formats</th>
				<th style="width: 3rem">labels</th>
				<th style="width: 3rem">cat #</th>
				<th style="width: 3rem">genres</th>
				<!--						<th>{JSON.stringify(release)}</th>-->

			</tr>

			{#each form?.searchResults?.results as release}

				<tr class:in-collection={isInCollection(release)} on:click={()=>updateCollection(release)}>

					<!--
					id
					master_id
					<td>{release.type}</td>
					-->
					<td><img src={release.thumb} alt="release cover" /><!--cover_image--></td>
					<td>{release.title}</td>
					<td>{release.year} - {release.country}</td>
					<td>{cleanup(release.format)}</td>
					<td>{cleanup(release.label)}</td>
					<td>{cleanup(release.barcode, release.catno)}  </td>
					<td>{cleanup(release.genre, release.style)}</td>
					<!--						<td>{JSON.stringify(release)}</td>-->

				</tr>

			{/each}
		</table>

	{/if}

</section>

<!--<pre>{JSON.stringify(data?.discogsCollectionLatestReleases,null,2)}</pre>-->


<style>
    fieldset {
        display: inline-block;
    }

    label {
        display: inline-block;
    }

    .in-collection {
        background-color: aquamarine;
    }
</style>