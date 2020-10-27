<script>
    import { onMount } from 'svelte';
    export let socket;
    export let ROOM_ID;
    
    import Video_camera from '../Components/Video_camera.svelte';
    import Video_roll from '../Components/Video_roll.svelte';
    import Video_pinned from '../Components/Video_pinned.svelte';
    
    onMount (() => {
        socket.emit('enter',ROOM_ID)
        console.log("rntered")
    })


</script>



<div>
    <Video_pinned />
    <Video_roll />
    <Video_camera />
</div>