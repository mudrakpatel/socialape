import React, {Component} from 'react';
import axios from 'axios';
import AppIcon from '../images/icon.png';
import {Link} from 'react-router-dom';
//To bring global styles and access global theme
import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from 'prop-types';
//MaterialUI imports
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

//The properties in this styles object
//can be accessed using 'classes.<propertyName>'
//within this React Component template.
const styles = (theme) => ({
    ...theme,
});

class Signup extends Component{
    constructor(props){
        super(props);
        this.state = {
            email: '',
            password: '',
            confirmPassword: '',
            handle: '',
            loading: false,
            errors: {},
        };
    }

    handleSubmit = (event) => {
        event.preventDefault();
        console.log('Login form submitted');
        this.setState({
            loading: true,
        });
        const newUserData = {
            email: this.state.email,
            password: this.state.password,
            confirmPassword: this.state.confirmPassword,
            handle: this.state.handle,
        };
        axios.post('/signup', newUserData).then((result) => {
            console.log(result);
            //Store the token in the localStorage of the browser
            localStorage.setItem('firebaseIdToken', `Bearer ${result.data.token}`);
            this.setState({
                loading: false,
            });
            //Redirect the user to the homepage after successfull login
            this.props.history.push('/');
        }).catch((err) => {
            this.setState({
                errors: err.response.data,
                loading: false,
            });
        });
    };

    handleOnChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value,
        });
    };

    render(){
        const {classes} = this.props;
        const {errors, loading} = this.state;
        return(
            <Grid container className={classes.form}>
                <Grid item sm/>
                <Grid item sm>
                    <img src={AppIcon} alt="monkey image" className={classes.image}/>
                    <Typography variant="h2" className={classes.pageTitle}>
                        Signup
                    </Typography>
                    <form noValidate onSubmit={this.handleSubmit}>
                        <TextField id="email" name="email" type="email" label="Email" className={classes.textField}
                            value={this.state.email} onChange={this.handleOnChange} fullWidth helperText={errors.email}
                            error={errors.email ? true : false}/>
                        <TextField id="password" name="password" type="password" label="Password" className={classes.textField}
                            value={this.state.password} onChange={this.handleOnChange} fullWidth helperText={errors.password}
                            error={errors.password ? true : false}/>
                        <TextField id="confirmPassword" name="confirmPassword" type="password" label="Confirm password" className={classes.textField}
                            value={this.state.confirmPassword} onChange={this.handleOnChange} fullWidth helperText={errors.confirmPassword}
                            error={errors.confirmPassword ? true : false}/>
                        <TextField id="handle" name="handle" type="text" label="Handle" className={classes.textField}
                            value={this.state.handle} onChange={this.handleOnChange} fullWidth helperText={errors.handle}
                            error={errors.handle ? true : false}/>
                            {
                                errors.general && (
                                    <Typography variant="body2" className={classes.customError}>
                                        {errors.general}
                                    </Typography>
                                )
                            }
                        <Button type="submit" variant="contained" color="primary" className={classes.button} disabled={loading}>
                            Signup
                            {
                                loading && (
                                    <CircularProgress size={30} className={classes.progress}/>
                                )
                            }
                        </Button>
                        <br/>
                        <small>
                            Don't have an account? Signup <Link to="/signup">here</Link>
                        </small>
                    </form>
                </Grid>
                <Grid item sm/>
            </Grid>
        )
    }
}

Signup.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Signup);