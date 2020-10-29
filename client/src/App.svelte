<script>
	import Conference from './Views/Conference.svelte'
	import {generateRoomWithoutSeparator} from '../scripts/randomRoom.js';
	import { onMount } from 'svelte';
	import { Router, Link, Route } from "svelte-routing";

	let socket;
	import io from 'socket.io-client';
	export let url = "/";
	let textValue ;
	let availabilityValue ;
	onMount(() => {
		socket = io('http://localhost:8000');
	})
	let str;
	let createRoom = () => {
		str = generateRoomWithoutSeparator(0);
		socket.emit("init",{
			id:str,
			students:[],
			desc: textValue.value,
			available: availabilityValue.value === "Public" ? true : false 
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
			<input bind:this={textValue} type="text" name="DESC" />
			<br>
			<label for="avail"> Room Type :</label>
			<select bind:this={availabilityValue} id ="avail">
				<option value="Public">Public</option>
				<option value="Private">Private</option>
			</select>
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