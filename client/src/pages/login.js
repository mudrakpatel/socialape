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
const styles = {
    form: {
        textAlign: 'center',
    },
    image: {
        marginTop: '20px',
        marginRight: 'auto',
        marginBottom: '20px',
        marginLeft: 'auto',
    },
    pageTitle: {
        marginTop: '10px',
        marginRight: 'auto',
        marginBottom: '10px',
        marginLeft: 'auto',
    },
    textField: {
        marginTop: '10px',
        marginRight: 'auto',
        marginBottom: '10px',
        marginLeft: 'auto',
    },
    button: {
        marginTop: '20px',
        position: 'relative',
    },
    customError: {
        color: 'red',
        fontSize: '0.8rem',
        marginTop: 10,
    },
    progress: {
        position: 'absolute',
    },
};

class Login extends Component{
    constructor(props){
        super(props);
        this.state = {
            email: '',
            password: '',
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
        const userData = {
            email: this.state.email,
            password: this.state.password,
        };
        axios.post('/login', userData).then((result) => {
            console.log(result);
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
                        Login
                    </Typography>
                    <form noValidate onSubmit={this.handleSubmit}>
                        <TextField id="email" name="email" type="email" label="Email" className={classes.textField}
                            value={this.state.email} onChange={this.handleOnChange} fullWidth helperText={errors.email}
                            error={errors.email ? true : false}/>
                        <TextField id="password" name="password" type="password" label="Password" className={classes.textField}
                            value={this.state.password} onChange={this.handleOnChange} fullWidth helperText={errors.password}
                            error={errors.password ? true : false}/>
                            {
                                errors.general && (
                                    <Typography variant="body2" className={classes.customError}>
                                        {errors.general}
                                    </Typography>
                                )
                            }
                        <Button type="submit" variant="contained" color="primary" className={classes.button} disabled={loading}>
                            Login
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

Login.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Login);