import React, {Component, Fragment} from 'react';
import Draggable from 'react-draggable';
import PropTypes from 'prop-types';
//Redux imports
import {connect} from 'react-redux';
//Actions imports
import {postScream, clearErrors} from '../../redux/actions/dataActions';
//Utilities ('util' folder) imports
import CustomTooltipButton from '../../util/CustomTooltipButton';
//Icon imports
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
//MUI(Material UI) imports
import CircularProgress from '@material-ui/core/CircularProgress';
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Paper from '@material-ui/core/Paper';

function PaperComponent(props){
    return(
        <Draggable handle="#draggable-dialog-title">
            <Paper {...props}/>
        </Draggable>
    );
};

const styles = (theme) => ({
    ...theme.spreadThis,
    submitButton: {
        position: 'relative',
        float: 'right',
        marginTop: 10,
    },
    progressSpinner: {
        position: 'absolute',
    },
});

class PostScream extends Component{
    state = {
        open: false,
        body: "",
        errors: {},
    };

    componentWillReceiveProps(nextProps){
        if(nextProps.UI.errors){
            this.setState({
                errors: nextProps.UI.errors,
            });
        }
        if(!nextProps.UI.errors && !nextProps.UI.loading){
            this.setState({
                body: "",
                open: false,
                errors: {},
            });
        }
    }

    handleOpen = () => {
        this.setState({open: true});
    };

    handleClose = () => {
        const {clearErrors} = this.props;
        clearErrors();
        this.setState({
            open: false,
            errors: {},
        });
    };

    handleSubmit = (event) => {
        event.preventDefault();
        const {body} = this.state;
        const {postScream} = this.props;
        postScream({body});
    };

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value, 
        });
    };

    render(){
        const {errors, open} = this.state;
        const {
            classes,
            UI: {
                loading,
            },
        } = this.props;
        return(
            <Fragment>
                <CustomTooltipButton onClick={this.handleOpen} tip="Post a scream!">
                    <AddIcon/>
                </CustomTooltipButton>
                <Dialog 
                    fullWidth 
                    maxWidth="sm" 
                    PaperComponent={PaperComponent}
                    open={open} onClose={this.handleClose} 
                    aria-labelledby="draggable-dialog-title">
                        <CustomTooltipButton tip="Close" onClick={this.handleClose} 
                            tipClassName={classes.closeButton}>
                                <CloseIcon/>
                        </CustomTooltipButton>
                        <DialogTitle id="draggable-dialog-title" style={{cursor: 'move'}}>
                            Post a new Scream
                        </DialogTitle>
                        <DialogContent>
                            <form onSubmit={this.handleSubmit}>
                                <TextField 
                                    name="body" type="text" label="SCREAM!!!" 
                                    placeholder="Scream for your fellow apes" 
                                    multiline rows="3" fullWidth
                                    error={errors.body ? true : false} 
                                    helperText={errors.body} 
                                    className={classes.textField} 
                                    onChange={this.handleChange}
                                />
                                <Button 
                                    type="submit" variant="contained" color="primary" 
                                    className={classes.submitButton} disabled={loading}>
                                        Submit
                                        {loading && (
                                                <CircularProgress size={30} className={classes.progressSpinner}/>
                                        )}
                                </Button>
                            </form>
                        </DialogContent>
                </Dialog>
            </Fragment>
        );
    };
}

PostScream.propTypes = {
    postScream: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired,
    UI: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    UI: state.UI,
});

const mapActionsToProps = {
    postScream,
    clearErrors,
};

export default connect(
    mapStateToProps,
    mapActionsToProps,
)(withStyles(styles)(PostScream));