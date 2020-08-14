import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import PropTypes from 'prop-types';
import MyButton from '../util/MyButton';
import DeleteYawp from './DeleteYawp';
import YawpDialog from './YawpDialog'

//MUI
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';

//Icons
import ChatIcon from '@material-ui/icons/Chat';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';



//Redux
import { connect } from 'react-redux';
import { likeYawp, unlikeYawp } from '../redux/actions/dataActions';



const styles = {
  card: {
    display: 'flex',
    marginBottom: 20
  },
  image: {
    minWidth: 200
  },
  content: {
    padding: 25,
    objectFit: 'cover'
  }
}


export class Yawp extends Component {

  likedYawp = () => {
    if (this.props.user.likes && this.props.user.likes.find(like => like.yawpId === this.props.yawp.yawpId)) {
      return true
    } else {
      return false
    }
  }

  likeYawp = () => {
    this.props.likeYawp(this.props.yawp.yawpId)
  }
  unlikeYawp = () => {
    this.props.unlikeYawp(this.props.yawp.yawpId)
  }
  render() {
    dayjs.extend(relativeTime);
    const { classes, yawp: { body, createdAt, userImage, userHandle, yawpId, likeCount, commentCount }, user: { authenticated, credentials: { handle } } } = this.props;
    const likeButton = !authenticated ? (
      <MyButton tip='Like'>
        <Link to='/login'>
          <FavoriteBorder color='primary/>' />
        </Link>
      </MyButton>
    ) : (
        this.likedYawp() ? (
          <MyButton tip='Undo Like' onClick={this.unlikeYawp}>
            <FavoriteIcon color='primary' />
          </MyButton>
        ) : (
            <MyButton tip='Like' onClick={this.likeYawp}>
              <FavoriteBorder color='primary' />
            </MyButton>
          )
      )
    const deleteButton = authenticated && userHandle === handle ? (
      <DeleteYawp yawpId={yawpId} />
    ) : null
    return (
      <Card className={classes.card}>
        <CardMedia
          className={classes.image}
          image={userImage}
          title="Profile Image" />
        <CardContent className={classes.content}>
          <Typography variant='h5' component={Link} to={`/users/${userHandle}`} color="primary">{userHandle}</Typography>
          {deleteButton}
          <Typography variant="body2" color="textSecondary">{dayjs(createdAt).fromNow()}</Typography>
          <Typography variant="body1">{body}</Typography>
          {likeButton}
          <span>{likeCount} Likes </span>
          <MyButton tip="Comments">
            <ChatIcon color="primary" />
          </MyButton>
          <span>{commentCount} Comments</span>
          <YawpDialog yawpId={yawpId} userHandle={userHandle} />
        </CardContent>
      </Card>
    )
  }
}

Yawp.propTypes = {
  likeYawp: PropTypes.func.isRequired,
  unlikeYawp: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  yawp: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  user: state.user,
})

const mapActionsToProps = {
  likeYawp,
  unlikeYawp
}

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(Yawp))
