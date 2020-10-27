<script>
    import { onMount } from "svelte";
    let cameraStream;

    onMount(() => {
        getCamera();
    })

    let getCamera = () => {
        navigator.getUserMedia(
            {video:{}},
            stream => (cameraStream.srcObject = stream),
            err => console.error(err)
        );
    }

</script>

<div class="web-cam">
    <video bind:this={cameraStream} autoplay muted ></video>
</div>


<style>
    .web-cam { 
        width: 120px;
        height: 120px;
        border-radius: 60px;
        -webkit-mask-image: -webkit-radial-gradient(circle,white,black);
        position: fixed;
        bottom: 10px;
        left: 10px;
    }
    video {
        width: 160px;
        height: 160px;
        position: relative;
        top: -20px;
        left: -20px;
    }
</style>