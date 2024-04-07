<script lang="ts">

	import { enhance } from '$app/forms';
	import { onMount } from 'svelte';

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
		document.status = 'updating collection with id ' + release.id + ' release ' + release.title;

		updateCollectionForm.release_id.value = release.id;
		updateCollectionForm.collection_action.value = release.user_data.in_collection ? 'remove' : 'add';
		updateCollectionForm.submit();
	}

	function isInCollection(release) {
		return release.user_data.in_collection || lastCollectionReleases.includes(release.id);
	}


	$: {
		autoSelect(form, updateCollectionForm);
	}

	function autoSelect(form, updateCollectionForm) {
		const foundReleases = form?.searchResults?.results;
		if (foundReleases && foundReleases.length === 1 && updateCollectionForm) {
			updateCollection(foundReleases[0]);
		}
	}

	onMount(() => {
		autoSelect(form, updateCollectionForm);
	});


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
			</tr>

			{#each form?.searchResults?.results as release}

				<tr class:in-collection={isInCollection(release)} class="add-to-collection"
						on:click={()=>updateCollection(release)} title="add to collection">
					<td><img src={release.thumb} alt="release cover" /><!--cover_image-->
						{release.id}
					</td>
					<td>{release.title}</td>
					<td>{release.year} - {release.country} - {release.type}</td>
					<td>{cleanup(release.format)}</td>
					<td>{cleanup(release.label)}</td>
					<td>{cleanup(release.barcode, release.catno)}  </td>
					<td>{cleanup(release.genre, release.style)}</td>
				</tr>

			{/each}
		</table>
	{:else}
		Please use a search form above to select releases to add to your collection
	{/if}

</section>
<section>
	<figure>
		<table>
			<tr>

				<th style="width: 3rem">cover</th>
				<th style="min-width: 30rem">title</th>
				<th style="min-width: 20rem">artist</th>
				<th style="width: 2rem">year</th>
				<th style="width: 2rem">formats</th>
				<th style="width: 2rem">labels</th>
				<th style="width: 2rem">cat #</th>
				<th style="width: 2rem">genres</th>
				<th style="width: 2rem">date added</th>
				<!--						<th>{JSON.stringify(release)}</th>-->

			</tr>

			{#each data?.discogsCollectionLatestReleases?.releases?.slice(0, 10) as release}

				<tr>
					<td><img src={release.basic_information.thumb} alt="release cover" />
						{release.id}
						<!--cover_image--></td>
					<td>{release.basic_information.title}</td>
					<td>{release.basic_information?.artists.map(x => x.name)}</td>
					<td>{release.basic_information.year}</td>
					<td>{cleanup(release.basic_information.formats?.map(x => x.name))}</td>
					<td>{cleanup(release.basic_information.labels?.map(x => x.name))}</td>
					<td>{cleanup(release.basic_information.labels?.map(x => x.catno))}  </td>
					<td>{cleanup(release.basic_information.genres, release.basic_information.styles)}</td>
					<td>{release.date_added}</td>
				</tr>

			{/each}
		</table>
	</figure>
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

    .add-to-collection {
        cursor: pointer;
    }

    .add-to-collection:hover {
        background-color: lightblue;
    }
</style>