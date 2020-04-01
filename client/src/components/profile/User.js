import React, {Component} from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
//Component imports
import StaticProfile from './StaticProfile';
import Scream from '../scream/Scream';
//Material UI (MUI) imports
import Grid from '@material-ui/core/Grid';
//Redux imports
import {connect} from 'react-redux';
//Action imports
import {getOtherUserData} from '../../redux/actions/dataActions';

class User extends Component{
    state = {
        profile: null,
        screamIdParam: null,
    };

    componentDidMount(){
        //Get the handle of the user 
        //whose details are required.
        const handle = this.props.match.params.handle;
        const screamId = this.props.match.params.screamId;
        if(screamId){
            this.setState({
                screamIdParam: screamId,
            });
        }
        const {getOtherUserData} = this.props;
        getOtherUserData(handle);
        axios.get(`/user/${handle}`).then((response) => {
            this.setState({
                profile: response.data.user,
            });
        }).catch((err) => {
            console.log(err);
        });
    }

    render(){
        const {screams, loading} = this.props.data;
        const {profile, screamIdParam} = this.state;
        const screamsMarkup = loading ? (
            <p>Loading data...</p>
        ) : screams === null ? (
            <p>No screams from this user</p>
        ) : !screamIdParam ? (
            screams.map((scream) => <Scream key={scream.screamId} scream={scream}/>)
        ) : (
            screams.map((scream) => {
                if(scream.screamId !== screamIdParam){
                    return <Scream key={scream.screamId} scream={scream}/>
                } else {
                    return <Scream key={scream.screamId} scream={scream} openDialog/>
                }
            })
        );
        return(
            <Grid container spacing={16}>
                <Grid item sm={8} xs={12}>
                    {screamsMarkup}
                </Grid>
                <Grid item sm={4} xs={12}>
                    {
                        profile === null ? (
                            <p>Loading profile...</p>
                        ) : (
                            <StaticProfile profile={profile}/>
                        )
                    }
                </Grid>
            </Grid>
        );
    }
}

User.propTypes = {
    getOtherUserData: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    data: state.data,
});

const mapActionsToProps = {
    getOtherUserData,
};

export default connect(
    mapStateToProps,
    mapActionsToProps,
)(User);