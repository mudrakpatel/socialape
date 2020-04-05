import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import dayjs from 'dayjs';
//Utilities ('Util' folder) imports
import CustomTooltipButtom from '../../util/CustomTooltipButton';
//MUI (Material UI) imports
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
//Icon imports
import DeleteIcon from '@material-ui/icons/DeleteOutline';

const styles = (theme) => ({
    ...theme.spreadThis,
    commentImage: {
        maxWidth: '100%',
        height: 100,
        objectFit: 'cover',
        borderRadius: '50%',
    },
    commentData: {
        marginLeft: 20,
    },
    grid2: {
        position: 'relative',
    },
    deleteButton: {
        top: '-16%',
        left: '90%',
        position: 'absolute'
    },
});

class Comments extends Component{

    handleOnClick = () => {
        
    };

    render(){
        const {
            comments, 
            classes,
        } = this.props;
        return(
            <Grid
                container>
                    {
                        comments.map(
                            (comment, index) => {
                                const {
                                    body,
                                    createdAt,
                                    userImage,
                                    userHandle,
                                    commentId,
                                } = comment;
                                return(
                                    <Fragment
                                        key={createdAt}>
                                            <Grid
                                                item
                                                sm={12}>
                                                    <Grid className={classes.grid2}
                                                        container>
                                                            <CustomTooltipButtom tip="Delete" onClick={this.handleOnClick} 
                                                                btnClassName={classes.deleteButton}>
                                                                    <DeleteIcon color="secondary"/>
                                                            </CustomTooltipButtom>
                                                            <Grid
                                                                item
                                                                sm={2}>
                                                                    <img
                                                                        src={userImage}
                                                                        alt="comment"
                                                                        className={classes.commentImage}
                                                                    />
                                                            </Grid>
                                                            <Grid
                                                                item
                                                                sm={9}>
                                                                    <div
                                                                        className={classes.commentData}>
                                                                            <Typography
                                                                                variant="h5"
                                                                                color="primary"
                                                                                component={Link}
                                                                                to={`/users/${userHandle}`}>
                                                                                    {userHandle}
                                                                            </Typography>
                                                                            <Typography
                                                                                variant="body2"
                                                                                color="textSecondary">
                                                                                    {dayjs(createdAt).format('h:mm a, DD MMMM YYYY')}
                                                                            </Typography>
                                                                            <hr
                                                                                className={classes.invisibleSeparator}
                                                                            />
                                                                            <Typography
                                                                                variant="body1">
                                                                                    {body}
                                                                            </Typography>
                                                                    </div>
                                                            </Grid>
                                                    </Grid>
                                            </Grid>
                                            {
                                                index !== comments.length - 1 && (
                                                    < hr
                                                        className={classes.visibleSeparator}
                                                    />
                                                )
                                            }
                                    </Fragment>
                                );
                            }
                        )
                    }
            </Grid>
        );
    };
};

Comments.propTypes = {
    comments: PropTypes.array.isRequired,
};

export default withStyles(styles)(Comments);