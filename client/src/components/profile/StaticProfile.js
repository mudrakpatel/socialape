import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import Link from 'react-router-dom/Link';
//MUI (Material UI) imports
import withStyles from '@material-ui/core/styles/withStyles';
import MUILink from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
//Icons
import LocationOn from '@material-ui/icons/LocationOn';
import LinkIcon from '@material-ui/icons/Link';
import CalendarToday from '@material-ui/icons/CalendarToday';

const styles = (theme) => ({
    ...theme.spreadThis,
    ...theme.spreadThis.profile,
});

const StaticProfile = (props) => {
    const {
        classes,
        profile: {
            handle,
            createdAt,
            imageURL,
            bio,
            website,
            location,
        },
    } = props;
    return(
        <Paper className={classes.paper}>
            <div className={classes.profile}>
                <div className="image-wrapper">
                    <img src={imageURL} className="profile-image" alt={`Profile picture of ${handle}`}/>
                </div>
                <hr/>
                <div className="profile-details">
                    <MUILink component={Link} to={`/users/${handle}`}
                        color="primary" variant="h5">
                            @{handle}
                    </MUILink>
                    <hr/>
                    {bio !== null && <Typography variant="h5">{bio}</Typography>}<hr/>
                    {location !== null && (
                        <Fragment>
                            <LocationOn color="primary" /> <span>{location}</span> <hr/>
                        </Fragment>
                    )}<hr/>
                    {website !== null && (
                        <Fragment>
                            <LinkIcon color="primary"/>
                            <a href={website} target="_blank" rel="noopener noreferer">{' '}{website}</a><hr/>
                        </Fragment>
                    )}
                    <CalendarToday color="primary" />{' '}
                    <span>Joined {dayjs(createdAt).format('MMM YYYY')}</span>
                </div>
            </div>
        </Paper>
    );
};

StaticProfile.propTypes = {
    profile: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(StaticProfile);