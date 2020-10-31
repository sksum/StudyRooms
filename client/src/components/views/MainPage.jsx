import React,{Component, useState} from 'react';
import {Container, AppBar, Toolbar, FormGroup, Typography, Button, FormControl, InputLabel ,Input, Fab, FormControlLabel,Switch as S,Grid} from  '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import {Room} from './Room.jsx';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useHistory,
  } from "react-router-dom";

const Form = () => {
    const history = useHistory();
    const [desc, setDesc] = useState('');
    const [avail, setAvail] = useState(true);

    return (
        < div style={{paddingTop: '2em'}} >
        <FormGroup style={{  border: '2px solid blue' }} >
            <FormControl style={{  margin: "20px", paddingBottom: '2em'}} >
            <Grid container direction="row"  alignItems="flex-start" spacing={1}>
                <Grid item sm={4}>
                    <InputLabel htmlFor="my-input">Description</InputLabel>
                    <Input id="my-input" value={desc} onChange = {(evt) => {setDesc(evt.target.value)}}/>
                </Grid>
                <Grid item sm={1}>
                    <FormControlLabel
                        control={<S checked={avail} onChange={() => {setAvail(!avail)}} />}
                        label={avail ? "Public":"Private"}
                    />
                    <br />
                    <Fab color="primary" aria-label="add">
                        <AddIcon onClick = {() => {
                            history.push(desc+(avail).toString());
                            // start/create room 




                        }}/>
                    </Fab>
                </Grid>
            </Grid>
            </FormControl>
        </FormGroup>
        </div>
    );
}

const Header = () => {
    return (
        <AppBar color="default" position="static">
            <Toolbar>
                <Typography variant="h6" >
                    <Link to="/" style={{ textDecoration: 'none' }}>Study Rooms</Link>
                </Typography>
                <Link to="/+" style={{ textDecoration: 'none' }}>
                    <Button color="secondary" >Create New +</Button>
                </Link>
            </Toolbar>
        </AppBar>

    );
}
  
export class MainPage extends Component {
    constructor (props) {
        super(props);
        this.state = {

        }
    }
    render () {
        return (
            <Router>
                <Container style={{paddingTop: '1em'}} >
                    <Header />
                    <Switch>
                        <Route path="/+" >
                            <Form />
                        </Route>
                        <Route path="/" exact>
                            MainPage
                        </Route>
                        <Route path="/rooms/:id" component = {Room}/> 
                    </Switch> 
                </Container>
            </Router>
        )
    }
} 