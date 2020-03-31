import React, {Component} from 'react';
import PropTypes from 'prop-types';
//Redux imports
import {connect} from 'react-redux';
//MUI (Material UI) imports
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
//Action imports
import {submitComment} from '../../redux/actions/dataActions';

const styles = (theme) => ({
    ...theme.spreadThis,
});

class CommentForm extends Component{
    state = {
        body: "",
        errors: {},
    };

    componentWillReceiveProps = (nextProps) => {
        if(nextProps.UI.errors){
            this.setState({
                errors: nextProps.UI.errors,
            });
        }
        if(!nextProps.UI.errors && !nextProps.UI.loading){
            this.setState({
                body: "",
            });
        }
    };

    handleOnSubmit = (event) => {
        event.preventDefault();
        const {submitComment, screamId} = this.props;
        const {body} = this.state;
        submitComment(screamId, {body});
    };

    handleOnChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value,
        });
    };

    render(){
        const {
            classes,
            authenticated,
        } = this.props;
        const {
            body,
            errors,
        } = this.state;
        //Comment form markup
        const commentFormMarkup = authenticated ? (
            <Grid item sm={12} style={{textAlign: 'center', }}>
                <form onSubmit={this.handleOnSubmit}>
                    <TextField 
                        fullWidth
                        name="body"
                        type="text"
                        value={body}
                        label="Comment on Scream"
                        helperText={errors.comment}
                        className={classes.textField}
                        error={errors.comment ? true : false}
                        onChange={this.handleOnChange}
                    />
                    <Button type="submit" variant="contained" 
                        color="primary" className={classes.button}>
                            Submit
                    </Button>
                </form>
                <hr className={classes.visibleSeparator}/>
            </Grid>
        ) : (null);
        return commentFormMarkup;
    };
};

CommentForm.propTypes = {
    submitComment: PropTypes.func.isRequired,
    authenticated: PropTypes.bool.isRequired,
    screamId: PropTypes.string.isRequired,
    classes: PropTypes.object.isRequired,
    UI: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    UI: state.UI,
    authenticated: state.user.authenticated,
});

const mapActionsToProps = {
    submitComment,
};

export default connect(
    mapStateToProps,
    mapActionsToProps,
)(withStyles(styles)(CommentForm));