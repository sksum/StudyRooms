import {useRef, useEffect} from 'react';
import {useParams } from 'react-router-dom';

const Video_camera =  (props) => {
    const selfVid = useRef(null);
    let localstream = null;
    const {id} = useParams(); 

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then( stream => {
                localstream = stream;
                selfVid.current.srcObject = stream;
            })
            .catch(error => {
                console.log(error);
            })


        console.log('mount it!');
        return () => {
            vidOff();
        }
    }, []);


    function vidOff() {
        //clearInterval(theDrawLoop);
        //ExtensionData.vidStatus = 'off';
        localstream.getTracks().forEach((track) => {
            track.stop();
          });        console.log("Vid off");
      }
    
    return (
        <>
            <video autoPlay className="selfView" ref={selfVid} />  
        </>
    );

}
export default Video_camera;