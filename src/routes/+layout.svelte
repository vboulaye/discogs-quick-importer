<script lang="ts">
	import "simpledotcss/simple.min.css";


	/** @type {import('./$types').PageData} */
	export let data;

</script>

<header>
	<h1>
		Welcome
		<img src={data.discogsUser.avatar_url} alt="avatar" class="image-avatar" />
		<a href="https://www.discogs.com/user/{data.discogsUser.username}/collection">
			{data.discogsUser.username}
		</a>
		({data.discogsUser.num_collection})
	</h1>
</header>

<main>
	<slot></slot>
</main>

<style>

    .image-avatar {
        width: 3rem;
        height: 3rem;
    }
    :root {
        --accent: darkcyan;
    }
</style>