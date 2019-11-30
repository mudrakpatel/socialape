import React, {Component} from 'react';
import Link from 'react-router-dom/Link';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';

class Navbar extends Component{
    render(){
        return(
            < AppBar > {/*default value for 'position' attribute is 'fixed'*/}
                <Toolbar>
                    <Button color='inherit'>Home</Button>
                    <Button color='inherit'>Login</Button>
                    <Button color='inherit'>Signup</Button>
                </Toolbar>
            </AppBar>
        )
    }
}

export default Navbar;