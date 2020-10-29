<script>
    import { onMount, onDestroy } from 'svelte';
    export let socket;
    export let ROOM_ID;
    
    import Video_camera from '../Components/Video_camera.svelte';
    import Video_pinned from '../Components/Video_pinned.svelte';
    import Video_rollContainer from '../Components/Video_rollContainer.svelte';
    
    let cameraStream;

    onMount(() => {
        getCamera();

        socket.emit('enter',ROOM_ID);

        socket.on("roomFound", room => {
            // callInvigilator(invilId);
            // invil.current = invilId;
            console.log("roomFound",room)
            callAllUsers(room.students)
        });

        socket.on("offer_received", handleRecieveCall);

        socket.on("answer_received", handleAnswer);

        socket.on("ice-candidate_received", handleNewICECandidateMsg);
    })

    onDestroy(() => {
        stopCamera();
    })

    let getCamera = () => {
        navigator.getUserMedia(
            {video:{}},
            stream => (cameraStream.srcObject = stream),
            err => console.error(err)
        );
    }
    
    let stopCamera = () => {
        const stream = cameraStream.srcObject;
        const tracks = stream.getTracks();

        tracks.forEach(function(track) {
            track.stop();
        });

        cameraStream.srcObject = null;
    }

//////////////////////////
    let listOfStreams = [];
    let userPeer;
    export let userStream;
    let listOfPeers = [];
 
    function callAllUsers (studentIDs) {
        studentIDs.forEach((id) => {
            if (id !== socket.id) callUser(id);
        })
    }
    function callUser(userID) {
        userPeer = createPeer(userID);
        userStream.current.getTracks().forEach(track => peerRef.current.addTrack(track, userStream.current));
    }

    function createPeer(invilId) {
        const peer = new RTCPeerConnection({
            iceServers: [
                {
                    urls: "stun:stun.stunprotocol.org"
                },
                {
                    urls: 'turn:numb.viagenie.ca',
                    credential: 'muazkh',
                    username: 'webrtc@live.com'
                },
            ]
        });

        peer.onicecandidate = handleICECandidateEvent;
        //peer.ontrack = handleTrackEvent;
        peer.onnegotiationneeded = () => handleNegotiationNeededEvent(invilId);

        return peer;
    }

    function handleNegotiationNeededEvent(userID) {
        peerRef.current.createOffer({offerToReceiveVideo: false}).then(offer => {
            return peerRef.current.setLocalDescription(offer);
        }).then(() => {
            const payload = {
                target: userID,
                caller: socketRef.current.id,
                sdp: peerRef.current.localDescription
            };
            socketRef.current.emit("offer", payload);
        }).catch(e => console.log(e));
    }

    function handleRecieveCall(incoming) {
        peerRef.current = createPeer();
        const desc = new RTCSessionDescription(incoming.sdp);
        peerRef.current.setRemoteDescription(desc).then(() => {
            userStream.current.getTracks().forEach(track => peerRef.current.addTrack(track, userStream.current));
        }).then(() => {
            return peerRef.current.createAnswer();
        }).then(answer => {
            return peerRef.current.setLocalDescription(answer);
        }).then(() => {
            const payload = {
                target: incoming.caller,
                caller: socketRef.current.id,
                sdp: peerRef.current.localDescription
            }
            socketRef.current.emit("answer", payload);
        })
    }

    function handleAnswer(message) {
        console.log("anwer")

        const desc = new RTCSessionDescription(message.sdp);
        peerRef.current.setRemoteDescription(desc).catch(e => console.log(e));
    }

    function handleICECandidateEvent(e) {
        if (e.candidate) {
            const payload = {
                target: invil.current,
                candidate: e.candidate,
            }
            socketRef.current.emit("ice-candidate", payload);
        }
    }

    function handleNewICECandidateMsg(incoming) {
        const candidate = new RTCIceCandidate(incoming);

        peerRef.current.addIceCandidate(candidate)
            .catch(e => console.log(e));
    }






</script>



<div>
    <Video_pinned />

    <div class="web-cam">
        <video bind:this ={cameraStream} autoplay muted ></video>
    </div>

    <Video_rollContainer {listOfStreams} />
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