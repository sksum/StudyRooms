<script>
    import { onMount } from "svelte";
    export let stream;

    onMount(() => {
    })


</script>

<div class="streamRoll">
    <video bind:this={stream} autoplay muted ></video>
</div>


<style>
    video {
        width: 160px;
        height: 160px;
    }
</style>
