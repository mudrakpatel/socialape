//Theme object for the app
export default {
        palette: {
            primary: {
                light: '#33c9dc',
                main: '#00bcd4',
                dark: '#008394',
                contrastText: '#fff'
            },
            secondary: {
                light: '#ff6333',
                main: '#ff3d00',
                dark: '#b22a00',
                contrastText: '#fff'
            },
        },
        //Other style data for Login and SignUp
    spreadThis: {
        typography: {
            useNextVariants: true,
        },
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
        closeButton: {
            position: 'absolute',
            left: '90%',
            top: '4%',
        },
    },
}