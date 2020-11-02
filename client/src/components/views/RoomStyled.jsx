import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import styled from "styled-components";

const Container = styled.div`
    padding: 20px;
    display: flex;
    height: 100vh;
    width: 90%;
    margin: auto;
    flex-wrap: wrap;
`;

const StyledVideo = styled.video`
    height: 40%;
    width: 50%;
`;

const Video = (props) => {
    const ref = useRef();

    useEffect(() => {
        props.peer.on("stream", stream => {
            ref.current.srcObject = stream;
        })
    }, []);

    return (
        <StyledVideo playsInline autoPlay ref={ref} />
    );
}


const videoConstraints = {
    height: window.innerHeight / 2,
    width: window.innerWidth / 2
};

const Room = (props) => {
    const [peers, setPeers] = useState([]);
    const socketRef = useRef();
    const userVideo = useRef();
    const peerRef = useRef([]);
    const otherPerson = useRef();
    console.log(props)
    const roomID = props.match.params.id;

    useEffect(() => {
        socketRef.current = io.connect("localhost:8000/");


        navigator.mediaDevices.getUserMedia({ video: videoConstraints, audio: false }).then(stream => {
            userVideo.current.srcObject = stream;
            socketRef.current.emit("joinRoom", roomID);
            socketRef.current.on("listOfPeers", users => {
                users.forEach(userID => {
                    socketRef.current.emit("calling peer",userID)
                    callPeer(userID);
                    console.log(`${socketRef.current.id} calling  ${userID}`)
                })
            })
        socketRef.current.on("called",(id) => {
            callPeer(id);
            console.log(`${socketRef.current.id} calling  ${id}`)
        })

        socketRef.current.on("offer_received", handleRecieveCall);

        socketRef.current.on("answer_received", handleAnswer);
 
        socketRef.current.on("ice-candidate_received", handleNewICECandidateMsg);
        })
    }, []);

    function callPeer(invilId) {
        console.log(`calling peer:${invilId}`)
        peerRef.current = createPeer(invilId);
        userVideo.current.srcObject.getTracks().forEach(track => peerRef.current.addTrack(track, userVideo.current.srcObject));
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

        peer.onicecandidate = (e) => handleICECandidateEvent(e,invilId);
        peer.ontrack = handleTrackEvent;
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
            userVideo.current.srcObject.getTracks().forEach(track => peerRef.current.addTrack(track, userVideo.current.srcObject));
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

    function handleICECandidateEvent(e,invil) {
        if (e.candidate) {
            const payload = {
                target: invil,
                candidate: e.candidate,
            }
            socketRef.current.emit("ice-candidate", payload);
        }
    }
    function handleTrackEvent(e) {
        console.log("new track",e);

    }

    function handleNewICECandidateMsg(incoming) {
        const candidate = new RTCIceCandidate(incoming);

        peerRef.current.addIceCandidate(candidate)
            .catch(e => console.log(e));
    }





    return (
        <Container>
            <StyledVideo muted ref={userVideo} autoPlay playsInline />
            {peers.map((peer, index) => {
                return (
                    <Video key={index} peer={peer} />
                );
            })}
            <StyledVideo playsInline autoPlay ref={otherPerson} />
        </Container>
    );
};

export default Room;