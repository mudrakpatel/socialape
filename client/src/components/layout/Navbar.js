import React, {Component, Fragment} from 'react';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
//Redux imports
import {connect} from 'react-redux';
//Component imports
import PostScream from '../scream/PostScream';
import Notifications from './Notifications';
//Utilities('util' folder) imports
import CustomTooltipButton from '../../util/CustomTooltipButton';
//MUI(Material UI) imports
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
//Icon imports
import HomeIcon from '@material-ui/icons/Home';

class Navbar extends Component{
    render(){
        const {authenticated} = this.props;
        return(
            <AppBar> {/*default value for 'position' attribute is 'fixed'*/}
                <Toolbar className="nav-container">
                    {
                        authenticated ? (
                            <Fragment>
                                <PostScream/>
                                <Link to="/">
                                    <CustomTooltipButton tip="Home">
                                        <HomeIcon/>
                                    </CustomTooltipButton>
                                </Link>
                                <Notifications/>
                            </Fragment>
                        ) : (
                            <Fragment>
                                <Button color='inherit' component={Link} to="/">Home</Button>
                                <Button color='inherit' component={Link} to="/login">Login</Button>
                                <Button color='inherit' component={Link} to="/signup">Signup</Button>
                            </Fragment>
                        )
                    }
                </Toolbar>
            </AppBar>
        )
    }
}

const mapStateToProps = (state) => ({
    authenticated: state.user.authenticated,
});

Navbar.propTypes = {
    authenticated: PropTypes.bool.isRequired,
};

export default connect(
    mapStateToProps,
)(Navbar);