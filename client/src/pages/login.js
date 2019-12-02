import React, {Component} from 'react';
import AppIcon from '../images/icon.png';
//To bring global styles and access global theme
import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from 'prop-types';
//MaterialUI imports
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

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
        console.log('Login form submitted');
    };

    handleOnChange = (event) => {
        
    };

    render(){
        const {classes} = this.props;
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
                            value={this.state.email} onChange={this.handleOnChange}/>
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