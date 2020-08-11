import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';

import Yawp from '../components/Yawp';
import Profile from '../components/Profile';

import { connect } from 'react-redux';
import { getYawps } from '../redux/actions/dataActions';


export class home extends Component {
  componentDidMount() {
    this.props.getYawps();
  }
  render() {
    const { yawps, loading } = this.props.data
    let recentYawpsMarkup = !loading ? (
      yawps.map(yawp => <Yawp key={yawp.yawpId} yawp={yawp} />)
    ) : <p>Loading...</p>
    return (
      <Grid container spacing={3}>
        <Grid item sm={8} xs={12}>
          {recentYawpsMarkup}
        </Grid>
        <Grid item sm={4} xs={12}>
          <Profile />
        </Grid>
      </Grid>
    );
  }
}

home.propTypes = {
  getYawps: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired
}

const mapStateToProps = state =>  ({
  data: state.data
})

export default connect(mapStateToProps, { getYawps })(home);
