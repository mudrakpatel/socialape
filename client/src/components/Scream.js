import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';

const styles = {
    //We will have a card
    card: {
        display: 'flex',
    }
};

const Scream = () => {
    const {classes, scream: {
        body, 
        createdAt, 
        userImage, 
        userHandle, 
        screamId,
        likeCount,
        commentCount,
    }} = this.props;
    return(
        <Card>
            <CardMedia image={userImage} title="Profile image"/>
            <CardContent>
                
            </CardContent>
        </Card>
    );
};

export default withStyles(styles)(Scream);