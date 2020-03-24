import React, {Component} from 'react';
import Grid from '@material-ui/core/Grid';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';
//Component imports
import Scream from '../components/Scream';
import Profile from '../components/Profile';
//Action imports
import {getScreams} from '../redux/actions/dataActions';

class Home extends Component{

    componentDidMount() {
        this.props.getScreams();
    }

    render(){
        const {screams, loading} = this.props.data;
        let recentScreams = loading ? (
            <p>Loading...</p>
        ) : (
            screams.map(scream => (
                <Scream key={scream.screamId} scream={scream}/>)
            )
        );
        return(
            <Grid container spacing={16}>
                <Grid item sm={8} xs={12}>
                    {recentScreams}
                </Grid>
                <Grid item sm={4} xs={12}>
                    <Profile/>
                </Grid>
            </Grid>
        )
    }
}

Home.propTypes = {
    data: PropTypes.object.isRequired,
    getScreams: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
    data: state.data,
});

const mapActionsToProps = {
    getScreams,
};

export default connect(
    mapStateToProps,
    mapActionsToProps,
)(Home);