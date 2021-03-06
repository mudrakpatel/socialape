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
        invisibleSeparator: {
            border: 'none',
            margin: 4,
        },
        visibleSeparator: {
            width: '100%',
            borderBottom: '1px solid rgba(0,0,0,0.1)',
            marginBottom: 20,
        },
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
            },
                paper: {
                        padding: 20
                    },
                    profile: {
                        '& .image-wrapper': {
                            textAlign: 'center',
                            position: 'relative',
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
                    },
    },
}