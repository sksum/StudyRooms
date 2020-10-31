import {React, Component} from 'react';
import Video_camera from '../utility/Video_camera.jsx';

export class Room extends Component {
    constructor (props) {
        super(props);
        this.state = {

        }
    }
    render () {
        return (
            <>
                <Video_camera />
            </>
        )
    }
} 