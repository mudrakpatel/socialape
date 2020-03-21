import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import dayjs from 'dayjs';
//Action imports
import {uploadImage, logoutUser} from '../redux/actions/userActions';
//MUI (Material UI) imports
import Button from '@material-ui/core/Button';
import MUILink from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
//Icons import
import LocationOn from "@material-ui/icons/LocationOn";
import LinkIcon from "@material-ui/icons/Link";
import CalendarToday from "@material-ui/icons/CalendarToday";
import EditIcon from "@material-ui/icons/Edit"

const styles = (theme) => ({
    paper: {
            padding: 20
        },
        profile: {
            '& .image-wrapper': {
                textAlign: 'center',
                position: 'relative',
                '& button': {
                    position: 'absolute',
                    top: '80%',
                    left: '70%'
                }
            },
            '& .profile-image': {
                width: 200,
                height: 200,
                objectFit: 'cover',
                maxWidth: '100%',
                borderRadius: '50%'
            },
            '& .profile-details': {
                textAlign: 'center',
                '& span, svg': {
                    verticalAlign: 'middle'
                },
                '& a': {
                    color: '#00bcd4'
                }
            },
            '& hr': {
                border: 'none',
                margin: '0 0 10px 0'
            },
            '& svg.button': {
                '&:hover': {
                    cursor: 'pointer'
                }
            }
        },
        buttons: {
            textAlign: 'center',
            '& a': {
                margin: '20px 10px'
            }
        }
});

class Profile extends Component {

    handleImageChange = (event) => {
        //Get the image from the event
        const image = event.target.files[0];
        //Send the form data to the server
        const formData = new FormData();
        formData.append('image', image, image.name);
        this.props.uploadImage(formData);
    };

    handleEditPicture = () => {
        const fileInput = document.getElementById('imageInput');
        fileInput.click();
    };

    render(){
        const {
                user: {
                    credentials: {
                        handle,
                        createdAt,
                        imageURL,
                        bio,
                        website,
                        location,
                    },
                    loading,
                    authenticated,
                }, 
                classes,} = this.props;

        let profileMarkup = !loading ? (
                authenticated ? (
                    <Paper className={classes.paper}>
                        <div className={classes.profile}>
                            <div className="image-wrapper">
                                <img src={imageURL} className="profile-image" alt="profile"/>
                                <input type="file" id="imageInput" hidden="hidden" onChange={this.handleImageChange}/>
                                <Tooltip title="Edit profile picture" placement="right-end">
                                    <IconButton onClick={this.handleEditPicture} className="button">
                                        <EditIcon color="primary"/>
                                    </IconButton>
                                </Tooltip>
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
                ) : (
                    <Paper className={classes.paper}>
                        <Typography variant="body2" align="center">No profile found, please log in again</Typography>
                        <div className={classes.buttons}>
                            <Button variant="contained" color="primary" component={Link} to="/login">Login</Button>
                            <Button variant="contained" color="secondary" component={Link} to="/signup">Signup</Button>
                        </div>
                    </Paper>
                )
            ) : (
            <p>loading...</p>
        );

        return profileMarkup;
    };
}

Profile.propTypes = {
    user: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    uploadImage: PropTypes.func.isRequired,
    logoutUser: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
    user: state.user,
});

const mapActionsToProps = {
    logoutUser,
    uploadImage,
};

export default connect(
    mapStateToProps,
    mapActionsToProps,
)(withStyles(styles)(Profile));