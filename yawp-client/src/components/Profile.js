import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import theme from '../util/theme';
import {Link} from 'react-router-dom';
import dayjs from 'dayjs';


//MUI
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import MuiLink from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography'

//Icons
import LocationOn from '@material-ui/icons/LocationOn';
import LinkIcon from '@material-ui/icons/Link';
import CalendarToday from '@material-ui/icons/CalendarToday';


//Redux
import { connect } from 'react-redux';


const styles = (theme) => ({
  ...theme.spreadThis
})


class Profile extends Component {
  render() {
    const { classes, user: { credentials: { handle, createdAt, imageUrl, bio, website, location }, loading, authenticated } } = this.props;

    let profileMarkup = !loading ? (authenticated ? (
      <Paper className={classes.paper}>
        <div className={classes.profile}>
          <div className="image-wrapper">
            <img src={imageUrl} alt="profile" className='profile-image' />
          </div>
          <hr />
          <div className="profile-details">
            <MuiLink Component={Link} to={`/users/${handle}`} color="primary" variant="h5">
              @{handle}
            </MuiLink>
            <hr/>
            {bio && (
              <Fragment>
                <Typography variant="body2">{bio}</Typography>
                <hr/>
              </Fragment>
            )}

            {location && (
              <Fragment>
                <LocationOn color="primary"/> <span>{location}</span>
                <hr/>
              </Fragment>
            )}
            {website && (
              <Fragment>
                <LinkIcon color='primary'/>
                <a href={website} target="_blank" rel="noopener noreferrer">
                  {'  '}{website}
                </a>
                <hr/>
              </Fragment>
            )}
            <CalendarToday color='primary'/> {'  '}
            <span>Joined {dayjs(createdAt).format('MMM YYYY')}</span>
          </div>
        </div>
      </Paper>
    ) : (
      <Paper className = {classes.paper}>
        <Typography variant="body2" align="center">
          No Profile Found, Please Log in
        </Typography>
        <div className = {classes.buttons}>
          <Button variant="contained" color="primary" component={Link} to='/login'>
            Login
          </Button>
          <Button variant="contained" color="secondary" component={Link} to='/signup'>
            Signup
          </Button>
        </div>
      </Paper>
    )) : (<p>Loading...</p>)

    return profileMarkup
  }
}

const mapStateToProps = (state) => ({
  user: state.user
})

Profile.propTypes = ({
  user: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired
})

export default connect(mapStateToProps)(withStyles(styles)(Profile))
