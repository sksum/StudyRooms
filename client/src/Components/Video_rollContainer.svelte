<script>
    import { onMount } from "svelte";
    import Video_roll from './Video_roll.svelte';
    export let listOfStreams;


</script>

<div class="roll-container">
    {#each listOfStreams as stream}
    <Video_roll {stream}></Video_roll>
    {/each}
</div>

<style>
    .roll-container {
        position: fixed;
        top: 100px;
        right: 10px;
        width: 200px;
        height: 700px;
        border: 1px solid #000000;
        overflow : scroll;

    }
</style>
