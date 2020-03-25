import React, {Component, Fragment} from 'react';
import Draggable from 'react-draggable';
import PropTypes from 'prop-types';
//Redux imports
import {connect} from 'react-redux';
//MUI(Material UI) imports
import withStyles from '@material-ui/core/styles/withStyles';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Paper from '@material-ui/core/Paper';
//Icons imports
import EditIcon from '@material-ui/icons/Edit';
//Actions imports
import {editUserDetails} from '../redux/actions/userActions';
//Utilities ('util' folder) imports
import CustomTooltipButton from '../util/CustomTooltipButton';

const styles = (theme) => ({
    ...theme.spreadThis,
    button: {
        float: 'right',
    },
});

function PaperComponent (props) {
    console.log("Opening movable dialog");
    return(
        <Draggable handle="#draggable-dialog-title">
            <Paper {...props}/>
        </Draggable>
    );
};

class EditDetails extends Component{
    state = {
        bio: "",
        website: "",
        location: "",
        open: false, /*States whether the edit dialog is open or not*/
    };

    componentDidMount(){
        const {credentials} = this.props;
        this.mapUserDetailsToState(credentials);
    };

    handleOpen = () => {
        const {credentials} = this.props;
        this.setState({
            open: true,
        });
        this.mapUserDetailsToState(credentials);
    };

    handleClose = () => {
        this.setState({
            open: false,
        });
    };

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value,
        });
    };

    handleSubmit = () => {
        /*NOTE: This method property will not take an event argument
                because the form element in the Dialog will not
                submit the changes.*/
        const userDetails = {
            bio: this.state.bio,
            website: this.state.website,
            location: this.state.location,
        };
        this.props.editUserDetails(userDetails);
        this.handleClose();
    };

    mapUserDetailsToState = (credentials) => {
        this.setState({
            bio: credentials.bio ? (credentials.bio) :
                (""),
            website: credentials.website ? (credentials.website) :
                (""),
            location: credentials.location ? (credentials.location) :
                (""),
        });
    };

    render(){
        const {classes} = this.props;
        return(
            <Fragment>
                {
                /*<Tooltip title="Edit details" placement="top">
                    <IconButton onClick={this.handleOpen} className={classes.button}>
                        <EditIcon color="primary"/>
                    </IconButton>
                   </Tooltip>*/
                }
                <CustomTooltipButton tip="Edit Details" placement="top"
                    onClick={this.handleOpen} 
                    btnClassName={classes.button}>
                        <EditIcon color="primary"/>
                </CustomTooltipButton>
                <Dialog open={this.state.open} onClose={this.handleClose} 
                    PaperComponent={PaperComponent} 
                    fullWidth
                    aria-labelledby="draggable-dialog-title"
                    maxWidth="xs"
                    scroll="paper">
                        <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">Edit your details</DialogTitle>
                        <DialogContent>
                            <form>
                            {/* Do not add submit action to this form 
                                because our Dialog actions will do that for us. */}
                                <TextField name="bio" type="text" label="Bio" multiline rows="3" 
                                    placeholder="A short bio about yourself" className={classes.textField}
                                    value={this.state.bio} onChange={this.handleChange} fullWidth/>
                                <TextField name="website" type="text" label="Website" 
                                    placeholder="Link to your personal/professional website" className={classes.textField}
                                    value={this.state.website} onChange={this.handleChange} fullWidth/>
                                <TextField name="location" type="text" label="Location" 
                                    placeholder="Where do you live?" className={classes.textField}
                                    value={this.state.location} onChange={this.handleChange} fullWidth/>
                            </form>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.handleClose} color="primary">Cancel</Button>
                            <Button onClick={this.handleSubmit} color="primary">Save</Button>
                        </DialogActions>
                </Dialog>
            </Fragment>
        );
    };
}

EditDetails.propTypes = {
    user: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    credentials: state.user.credentials,
});

const mapActionsToProps = {
    editUserDetails,
};

export default connect(
    mapStateToProps,
    mapActionsToProps,
)(withStyles(styles)(EditDetails));