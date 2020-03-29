import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import Draggable from 'react-draggable';
//Redux imports
import {connect} from 'react-redux';
//Utilities ('util' folder) imports
import CustomTooltipButtom from '../../util/CustomTooltipButton';
//Actions imports
import {deleteScream} from '../../redux/actions/dataActions';
//MUI (Material UI) imports
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import Paper from '@material-ui/core/Paper';
//Icon imports
import DeleteIcon from '@material-ui/icons/DeleteOutline';

const styles = {
    deleteButton: {
        position: 'absolute',
        top: '10%',
        left: '90%',
    },
};

function PaperComponent (props) {
    console.log("Opening movable dialog");
    return(
        <Draggable handle="#draggable-dialog-title">
            <Paper {...props}/>
        </Draggable>
    );
};

class DeleteScream extends Component {

    state = {
        open: false,
    };

    handleOpen = () => {
        this.setState({
            open: true,
        });
    };

    handleClose = () => {
        this.setState({
            open: false,
        });
    };

    handleDeleteScream = () => {
        const {deleteScream, screamId} = this.props;
        deleteScream(screamId);
        this.setState({
            open: false,
        });
    };

    render(){
        const {classes} = this.props;
        const {open} = this.state;
        return(
            <Fragment>
                <CustomTooltipButtom tip="Delete" onClick={this.handleOpen} 
                    btnClassName={classes.deleteButton}>
                        <DeleteIcon color="secondary"/>
                </CustomTooltipButtom>
                <Dialog aria-labelledby="draggable-dialog-title" fullWidth
                    PaperComponent={PaperComponent} open={open} onClose={this.handleClose}
                    maxWidth="xs" scroll="paper">
                        <DialogTitle style={{cursor: 'move'}} id="draggable-dialog-title">
                            Are you sure that you want to DELETE this scream?
                        </DialogTitle>
                        <DialogActions>
                            <Button onClick={this.handleClose} color="primary">
                                Cancel
                            </Button>
                            <Button onClick={this.handleDeleteScream} color="secondary">
                                Delete
                            </Button>
                        </DialogActions>
                </Dialog>
            </Fragment>
        );
    };
};

DeleteScream.propTypes = {
    deleteScream: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    screamId: PropTypes.string.isRequired,
};

const mapActionsToProps = {
    deleteScream,
};

export default connect(
    null, /* We do not need anything from the state */
    mapActionsToProps,
)(withStyles(styles)(DeleteScream));