import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import MyButton from '../util/MyButton';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';

//MUI
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

//ICONS
import CloseIcon from '@material-ui/icons/Close';
import UnfoldMore from '@material-ui/icons/UnfoldMore';


//Redux
import { connect } from 'react-redux';
import { getYawp } from '../redux/actions/dataActions';


const styles = theme => ({
  ...theme.spreadThis,
  invisibleSeparator: {
    border: 'none',
    margin: 4
  },
  profileImage: {
    maxWidth: 200,
    height: 200,
    borderRadius: '50%',
    objectFit: 'cover',
  },
  dialogContent: {
    padding: 20
  },
  closeButton: {
  position: 'absolute',
  left: '90%'
  },
  spinnerDiv: {
    textAlign: 'center',
    marginTop: 50,
    marginBottom: 50
  }
})

class YawpDialog extends Component {
  state = {
    open: false
  }

  handleOpen = () => {
    this.setState({
      open: true
    })
    this.props.getYawp(this.props.yawpId)
  }

  handleClose = () => {
    this.setState({
      open: false
    })
  }

  render() {
    const { classes, yawp: { yawpId, body, createdAt, likeCount, commentCount, userImage, userHandle }, UI: { loading } } = this.props;

    const dialogMarkup = loading ? (
      <div className={classes.spinnerDiv}>
        <CircularProgress size={200} thickness={2}/>
      </div>
    ) : (
      <Grid container spacing={16}>
        <Grid item sm={5}>
          <img src={userImage} alt='Profile Picture' className={classes.profileImage}/>
        </Grid>
        <Grid item sm={7}>
          <Typography component={Link} color='primary' variant='h5' to={`/users/${userHandle}`}>
            @{userHandle}
          </Typography>
          <hr className={classes.invisibleSeparator}/>
          <Typography variant='body2' color='textSecondary'>
            {dayjs(createdAt).format('h:mm a, MMMM DD YYYY')}
          </Typography>
          <hr className={classes.invisibleSeparator}/>
          <Typography variant='body1'>
            {body}
          </Typography>
        </Grid>
      </Grid>
    )

    return (
      <Fragment>
        <MyButton onClick={this.handleOpen} tip='Yawp Details'>
          <UnfoldMore color='primary'/>
        </MyButton>
        <Dialog open={this.state.open} onClose={this.handleClose} fullWidth maxWidth='sm'>
          <MyButton tip='Close' onClick={this.handleClose} tipClassName={classes.closeButton}>
            <CloseIcon />
          </MyButton>
        <DialogContent className={classes.dialogContent}>
          {dialogMarkup}
        </DialogContent>
        </Dialog>
      </Fragment>
    )
  }

}

YawpDialog.propTypes = {
  getYawp: PropTypes.func.isRequired,
  yawpId: PropTypes.string.isRequired,
  userHandle: PropTypes.string.isRequired,
  yawp: PropTypes.object.isRequired,
  UI: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  yawp: state.data.yawp,
  UI: state.UI
})

const mapActionsToProps = {
  getYawp
}

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(YawpDialog))