<script>
	import Conference from './Views/Conference.svelte'
	import {generateRoomWithoutSeparator} from '../scripts/randomRoom.js';
	import { onMount } from 'svelte';
	import { Router, Link, Route } from "svelte-routing";

	let socket;
	import io from 'socket.io-client';
	export let url = "/";
 
	onMount(() => {
		socket = io('http://localhost:8000');
	})
	let str;
	let createRoom = () => {
		str = generateRoomWithoutSeparator(0);
		socket.emit("init",{
			id:str,
			students:[],
			desc:"new room v1",
			available: false
		})
		//window.open("http://localhost:5000/room")
	}
</script>

<main>
	<Router url={url}>
		<nav>
			<Link to="/">Home</Link>
			<Link to={`/rooms/${str}`}>room</Link>
		</nav>
		<Route path="/">
			<button on:click={createRoom}>+</button>
		</Route>
		<Route path="/room" > Helo world </Route>
		<Route path="/rooms/:id" let:params>
			<Conference {socket} ROOM_ID={params.id} />
		</Route>
	</Router>
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}
	button {
		width: 30px;
		height: 30px;
	}
</style>